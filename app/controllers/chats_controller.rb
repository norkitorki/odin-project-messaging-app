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
      index = chat&.messages.order(:created_at).index { |m| !m.deleted && m.pub_id == params[:message] }
      return redirect_to_message(chat, index) if index
    end

    @page = params[:page] ? params[:page].to_i : 1
    @chat = chat.json_with_images
    @messages = chat.messages.includes(:user, :replies).top.ordered_by_creation.offset((@page - 1) * 30).limit(30)
    @page_count = chat.pages
  end

  def create
    chat = Chat.new(name: chat_params[:name], private: chat_params[:private] ? true : false, admin: current_user, users: [ current_user ])

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

  def redirect_to_message(chat, index)
    index += 1
    page = index % 30 == 0 ? index / 30 : (index / 30) + 1
    redirect_to chat_path(pub_id: chat.pub_id, page: page, m: params[:message])
  end
end
