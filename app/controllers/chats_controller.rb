class ChatsController < ApplicationController
  include PaginationHelper

  before_action :authenticate_user!, except: [ :index, :show, :users ]
  before_action :use_jsx_rendering_defaults, except: [ :create, :destroy ]

  def index
    chats = Chat.includes(:admin, :users).ordered_by_activity.page(params[:page]).per(30)
    @chats, @pages = pagination_data(chats = Chat.includes(:admin, :users).ordered_by_activity.page(params[:page]).per(30), chats_path, 30, :page, [ :props_at, "data.chats" ])
  end

  def new
    @chat = Chat.new
  end

  def show
    chat = Chat.find_by(pub_id: params[:pub_id])
    @user_is_member = user_signed_in? && (chat.admin == current_user || chat.users.include?(current_user))
    return redirect_back_or_to chats_path, alert: "You are unauthorized to view this chat" if chat.private && !@user_is_member

    if chat
      messages = chat.messages.ordered_by_creation.top
      if params[:message]
        message_id = params[:message]
        parent_id = params[:parent] || nil
        index = messages.index { |m| !m.deleted && (m.pub_id == parent_id || m.pub_id == message_id) }
        return redirect_to_message(chat, index, message_id, parent_id) if index
      end

      @chat = chat.json_with_images
      default_page = params[:page] || (messages.count / 30.0).ceil
      @messages, @pages = pagination_data(messages.includes(:user, :images_blobs).page(default_page).per(30), chat_path(pub_id: chat.pub_id), 30, :page, [ :props_at, "data.messages" ])
      @new_message = chat.messages.new
      @replies = chat_replies(chat.id)
    end
  end

  def create
    @chat = Chat.new(chat_params.merge({ admin: current_user, users: [ current_user ] }))

    if @chat.save
      redirect_to chat_path(pub_id: @chat.pub_id), notice: "Chat created"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    chat = CoolId.locate(params[:chat_id])
    chat.destroy if chat

    redirect_to chats_path, alert: "Chat deleted"
  end

  def users
    chat = Chat.find_by(pub_id: params[:chat_id])
    @users = chat.users.includes(:avatar_blob).ordered_by_username
    @chat_data = { name: chat.name, path: chat_path(pub_id: chat.pub_id) }
  end

  private

  def chat_params
    params.require(:chat).permit(:name, :private)
  end

  def redirect_to_message(chat, index, message_id, parent_id = nil)
    page = index / 30 + 1
    redirect_to chat_path(pub_id: chat.pub_id, page: page < 1 ? 1 : page, m: message_id, p: parent_id)
  end

  def chat_replies(chat_id)
    replies = Hash.new { |h, k| h[k] = [] }
    Message.includes(:user, :images_blobs).where(chat_id: chat_id, parent_id: @messages.map(&:pub_id)).ordered_by_creation.each do |message|
      replies[message.parent_id] << message
    end
    replies
  end
end
