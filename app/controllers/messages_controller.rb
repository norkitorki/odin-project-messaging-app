class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = current_user.chats.find_by(pub_id: message_params[:chat_id])

    if chat
      message = message_params[:message]
      chat.messages.create(value: message, user_id: current_user.id) if chat && !message&.empty?
    end

    redirect_back_or_to root_path
  end

  def destroy
    message = current_user.messages.find_by(pub_id: message_params[:message_id])

    message&.destroy
    redirect_back_or_to root_path, notice: "Message destroyed"
  end

  private

  def message_params
    params.permit(:chat_id, :message, :message_id)
  end
end
