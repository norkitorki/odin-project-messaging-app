class ChatsController < ApplicationController
  include PaginationHelper

  before_action :authenticate_user!, except: [ :index, :show, :users ]
  before_action :use_jsx_rendering_defaults, except: [ :create, :destroy ]

  def index
    chats = (user_signed_in? ? current_user.available_chats : Chat.where(private: false)).includes(:admin).ordered_by_activity.page(params[:page]).per(30)
    @chats, @pages = pagination_data(chats, chats_path, 30, :page, [ :props_at, "data.chats" ])
  end

  def new
    @chat = Chat.new
  end

  def show
    @chat = Chat.find_by(pub_id: params[:pub_id])
    @user_is_member = user_signed_in? && (@chat.admin_id == current_user.id || @chat.users.include?(current_user))
    return redirect_back_or_to chats_path, alert: "You are unauthorized to view this chat" if @chat.private && !@user_is_member

    if @chat
      messages = @chat.messages.includes(user: [ :avatar_blob ]).ordered_by_creation
      return redirect_to_message(@chat, messages) if params[:message]

      default_page = params[:page] || (messages.count / 30.0).ceil
      @messages, @pages = pagination_data(messages.includes(:images_blobs).page(default_page).per(30), chat_path(pub_id: @chat.pub_id), 30, :page, [ :props_at, "data.messages" ])
      @new_message = @chat.messages.new
      @replies = chat_replies(messages)
    end
  end

  def create
    @chat = Chat.new(chat_params.merge({ admin: current_user, users: [ current_user ] }))

    if @chat.save
      redirect_to chat_path(pub_id: @chat.pub_id), notice: "Chat created"
    else
      render :new, status: :unprocessable_content
    end
  end

  def destroy
    chat = current_user.chats.find_by(pub_id: params[:chat_id])
    alert = chat&.destroy ? "Chat deleted" : "Chat could not be found"

    redirect_to chats_path, alert: alert
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

  def redirect_to_message(chat, messages)
    message_id = params[:message]
    parent_id = params[:parent] || nil
    index = messages.index { |m| !m.deleted && (m.pub_id == parent_id || m.pub_id == message_id) }
    if index
      page = index / 30 + 1
      redirect_to chat_path(pub_id: chat.pub_id, page: page < 1 ? 1 : page, m: message_id, p: parent_id), status: :found
    end
  end

  def chat_replies(messages)
    replies = Hash.new { |h, k| h[k] = [] }
    messages.sub.each { |message| replies[message.parent_id] << message }
    replies
  end
end
