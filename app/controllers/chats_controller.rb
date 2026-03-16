class ChatsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, only: :index

  def index
  end

  def create
    user_ids = params[:user_ids].map { |id| CoolId.locate(id) }
    Chat.open(current_user, *user_ids)

    redirect_back_or_to root_path
  end

  def destroy
    chat = CoolId.locate(params[:chat_id])

    if chat
      chat.users.delete(current_user)

      redirect_back_or_to root_path
    end
  end
end
