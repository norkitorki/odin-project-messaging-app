class ChatMembersController < ApplicationController
  before_action :authenticate_user!

  def create
    chat_id = params[:chat_id]

    if chat_id
      chat = CoolId.locate(chat_id)
      if chat && !chat.private
        existing_user = chat.users.include?(current_user)
        chat.users << current_user unless existing_user
        notice = existing_user ? "You are already a member" : "You joined the chat"
      end
    else
      users = params[:user_ids]&.map { |id| CoolId.locate(id) }
      chat = Chat.open(current_user, *users)
      notice = "You created a chat"
    end

    redirect_to chat_path(pub_id: chat.pub_id), notice: notice
  end

  def destroy
    chat = CoolId.locate(params[:chat_id])

    if chat
      chat.users.delete(current_user)
      chat.messages.where(user: current_user).destroy_all

      redirect_to chats_path, notice: "You left a chat", status: :see_other
    end
  end
end
