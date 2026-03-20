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

  def update
    return mark_as_deleted if params[:destroy]

    message = current_user.messages.find_by(pub_id: message_params[:message_id])
    message&.value = message_params[:message]
    notice = "Message #{message&.save ? '' : 'not'} updated"

    redirect_back_or_to root_path, notice: notice
  end

  private

  def message_params
    params.permit(:chat_id, :message, :message_id)
  end

  def mark_as_deleted
    message = CoolId.locate(message_params[:message_id])
    auth_user = message&.chat.admin == current_user && "Admin" ||
                message&.user == current_user && "User"

    if auth_user
      message.value = "Message removed by #{auth_user}"
      message.deleted = true
      message.save(validate: false)
    end

    redirect_back_or_to root_path, notice: auth_user ? "Message deleted by #{auth_user}" : nil
  end
end
