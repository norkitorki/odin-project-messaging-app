class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = current_user.chats.find_by(pub_id: params[:chat_id])

    if chat
      message = current_user.messages.new(message_params.merge({ chat_id: chat.id }))
      if message.save
        return redirect_to chat_path(pub_id: chat.pub_id, message: message.pub_id, parent: message.parent_id), notice: "Message saved"
      else
        return redirect_to chat_path(pub_id: chat.pub_id), alert: "Message could not be saved"
      end
    end

    redirect_back_or_to root_path
  end

  def update
    return mark_as_deleted if params[:destroy]

    message = current_user.messages.find_by(pub_id: params[:message_id])
    message&.value = message_params[:value]
    message_params[:images]&.each { |key| message.images.find { |img| img.key == key }.purge_later }
    notice = "Message #{message&.save ? '' : 'not'} updated"

    redirect_back_or_to root_path, notice: notice
  end

  private

  def message_params
    params.require(:message).permit(:value, :parent_id, images: [])
  end

  def mark_as_deleted
    message = Message.find_by(pub_id: params[:message_id])
    auth_user = message&.chat.admin == current_user && "Admin" ||
                message&.user == current_user && "User"

    if auth_user
      message.value = "Message removed by #{auth_user}"
      message.deleted = true
      message.images.purge_later
      message.replies.destroy_all
      message.save(validate: false)
    end

    redirect_back_or_to root_path, notice: auth_user ? "Message deleted by #{auth_user}" : nil
  end
end
