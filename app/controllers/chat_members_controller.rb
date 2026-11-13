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
    chat = current_user.chats.find_by(pub_id: params[:chat_id])

    if chat
      chat.users.destroy(current_user)
      chat.messages.where(user: current_user).destroy_all

      redirect_to chat.private ? chats_path : chat_path(pub_id: chat.pub_id), alert: "You left a chat", status: :see_other
    else
      redirect_to chats_path, alert: "User is not a member of this chat"
    end
  end
end
