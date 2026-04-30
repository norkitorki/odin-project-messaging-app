class ChatsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, except: [ :create, :destroy ]

  def index
  end

  def new
  end

  def show
    c = Chat.find_by(pub_id: params[:pub_id])
    return redirect_back_or_to chats_path, notice: "Chat is private" if c.private && !c.users.include?(current_user)

    @page = params[:page] ? params[:page].to_i : 1
    @chat = c.json_with_images
    @messages = c.messages.includes(:user).ordered_by_creation.offset((@page - 1) * 30).limit(30)
    @page_count = c.pages
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
end
