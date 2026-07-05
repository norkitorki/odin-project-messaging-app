class ChatsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, except: [ :create, :destroy ]

  def index
  end

  def new
    @chat = Chat.new
  end

  def show
    chat = Chat.find_by(pub_id: params[:pub_id])
    @user_is_member = chat.admin == current_user || chat.users.include?(current_user)
    if chat.private && !@user_is_member
      flash[:alert] = "You are unauthorized to view this chat"
      return redirect_back_or_to chats_path
    end

    if chat
      messages = chat.messages.ordered_by_creation.top
      if params[:message]
        message_id = params[:message]
        parent_id = params[:parent] || nil
        index = messages.index { |m| !m.deleted && (m.pub_id == parent_id || m.pub_id == message_id) }
        return redirect_to_message(chat, index, message_id, parent_id) if index
      end

      @page_count = chat.pages
      @page = params[:page] ? params[:page].to_i : @page_count
      @chat = chat.json_with_images
      @messages = messages.includes(:user).offset((@page - 1) * 30).limit(30)
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
    Message.includes(:user).where(chat_id: chat_id, parent_id: @messages.map(&:pub_id)).ordered_by_creation.each do |message|
      replies[message.parent_id] << message
    end
    replies
  end
end
