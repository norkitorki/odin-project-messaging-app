class ChatMembersController < ApplicationController
  before_action :authenticate_user!

  def create
    chat = Chat.find_by(pub_id: params[:chat_id])

    if chat.private
      alert = "Unable to join a private chat"
    else
      if chat.users.include?(current_user)
        alert = "You are already a member"
      else
        chat.users << current_user
        notice = "You joined the chat"
      end
    end

    redirect_to chat_path(pub_id: chat.pub_id), notice: notice, alert: alert
  end

  def destroy
    chat = Chat.find_by(pub_id: params[:chat_id])

    if chat
      chat.users.delete(current_user)
      chat.messages.joins(:images_blobs).where(user: current_user).distinct.destroy_all
      chat.messages.where(user: current_user).delete_all

      redirect_to chats_path, alert: "You left a chat", status: :see_other
    end
  end
end
