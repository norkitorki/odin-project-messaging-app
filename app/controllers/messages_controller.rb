class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = current_user.chats.find_by(pub_id: params[:chat_id])

    if chat
      message = current_user.messages.new(message_params.merge({ chat_id: chat.id }))
      if message.save
        redirect_to chat_path(pub_id: chat.pub_id, message: message.pub_id, parent: message.parent_id), notice: "Message saved"
      else
        redirect_to chat_path(pub_id: chat.pub_id), alert: "Message could not be saved"
      end
    else
      redirect_back_or_to chats_path, alert: "You are not a member of this chat"
    end
  end

  def update
    message = current_user.messages.find_by(pub_id: params[:message_id])
    if message
      message.value = message_params[:value]
      message_params[:images]&.each { |key| message.images.find { |img| img.key == key }.purge_later }
      notice = "Message#{message.save ? ' ' : ' not '}updated"
      redirect_to chat_path(pub_id: message.chat.pub_id, message: message.pub_id, parent: message.parent_id), notice: notice
    else
      redirect_back_or_to root_path, alert: "Message could not be found"
    end
  end

  def destroy
    message = current_user.messages.find_by(pub_id: params[:message_id])

    if message
      chat = message.chat
      message.destroy
      redirect_to chat_path(pub_id: chat.pub_id, message: message.parent_id), alert: "Message successfully deleted"
    else
      redirect_to chats_path, alert: "Message could not be found"
    end
  end

  private

  def message_params
    params.require(:message).permit(:value, :parent_id, images: [])
  end
end
