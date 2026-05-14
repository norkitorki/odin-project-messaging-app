class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = current_user.chats.find_by(pub_id: message_params[:chat_id])

    if chat
      message = message_params[:message]
      parent_id = message_params[:parent_id]
      if chat && !message&.empty?
        message = chat.messages.create!(value: message, user_id: current_user.id, parent_id: parent_id)
        message.images.attach(params[:images])
        return redirect_to chat_path(pub_id: chat.pub_id, message: parent_id) if parent_id
        return redirect_to chat_path(pub_id: chat.pub_id, page: chat.pages)
      end
    end

    redirect_back_or_to root_path
  end

  def update
    return mark_as_deleted if params[:destroy]

    message = current_user.messages.find_by(pub_id: message_params[:message_id])
    message&.value = message_params[:message]
    message_params[:images]&.each { |key| message.images.find { |img| img.key == key }.purge_later }
    notice = "Message #{message&.save ? '' : 'not'} updated"

    redirect_back_or_to root_path, notice: notice
  end

  private

  def message_params
    params.permit(:chat_id, :message, :message_id, :parent_id, images: [])
  end

  def mark_as_deleted
    message = Message.find_by(pub_id: message_params[:message_id])
    auth_user = message&.chat.admin == current_user && "Admin" ||
                message&.user == current_user && "User"

    if auth_user
      message.value = "Message removed by #{auth_user}"
      message.deleted = true
      message.images.purge_later
      message.save(validate: false)
    end

    redirect_back_or_to root_path, notice: auth_user ? "Message deleted by #{auth_user}" : nil
  end
end
