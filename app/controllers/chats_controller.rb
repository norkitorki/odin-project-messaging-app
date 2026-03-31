class ChatsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, only: [ :index, :new ]

  def index
  end

  def new
  end

  def create
    chat = Chat.new(name: chat_params[:name], private: chat_params[:private] ? true : false, admin: current_user, users: [ current_user ])

    if chat.save
      redirect_to chats_path
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
