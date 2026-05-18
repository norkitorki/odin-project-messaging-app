class ChatsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, except: [ :create, :destroy ]

  def index
  end

  def new
  end

  def show
    chat = Chat.find_by(pub_id: params[:pub_id])
    return redirect_back_or_to chats_path, notice: "Chat is private" if chat.private && !chat.users.include?(current_user)

    if params[:message]
      message_id = params[:message]
      parent_id = params[:parent]
      chat&.messages.ordered_by_creation.each.with_index do |message, i|
        if !message.deleted
          break redirect_to_message(chat, i, message_id, parent_id) if message.pub_id == parent_id
          break redirect_to_message(chat, i, message_id) if message.pub_id == message_id
        end
      end
    end

    @page = params[:page] ? params[:page].to_i : 1
    @chat = chat.json_with_images
    @messages = chat.messages.includes(:user).top.ordered_by_creation.offset((@page - 1) * 30).limit(30)
    @replies = chat_replies(chat.id)
    @page_count = chat.pages
  end

  def create
    chat = Chat.new(name: chat_params[:name], private: chat_params[:private] == "1" ? true : false, admin: current_user, users: [ current_user ])

    if chat.save
      redirect_to chat_path(pub_id: chat.pub_id), notice: "Chat created"
    else
      @errors = chat.errors
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    chat = CoolId.locate(params[:chat_id])
    chat.destroy if chat

    redirect_back_or_to chats_path
  end

  private

  def chat_params
    params.permit(:name, :private)
  end

  def redirect_to_message(chat, index, message_id, parent_id = nil)
    index += 1
    page = index % 30 == 0 ? index / 30 : (index / 30) + 1
    redirect_to chat_path(pub_id: chat.pub_id, page: page, m: message_id, p: parent_id)
  end

  def chat_replies(chat_id)
    replies = {}
    Message.includes(:user).where(chat_id: chat_id, parent_id: @messages.map(&:pub_id)).order(:created_at).each do |m|
      replies[m.parent_id] ? replies[m.parent_id] << m : replies[m.parent_id] = [ m ]
    end
    replies
  end
end
