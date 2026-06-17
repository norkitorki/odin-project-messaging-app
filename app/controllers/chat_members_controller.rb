class ChatMembersController < ApplicationController
  before_action :authenticate_user!

  def create
    chat_id = params[:chat_id]

    if chat_id
      chat = CoolId.locate(chat_id)
      if chat && !chat.private
        existing_user = chat.users.include?(current_user)
        if !existing_user
          chat.users << current_user
          flash[:success] = "You joined the chat"
        end
        notice = "You are already a member"
      end
    else
      users = params[:user_ids]&.map { |id| CoolId.locate(id) }
      chat = Chat.open(current_user, *users)
      notice = "You created a chat"
    end

    redirect_to chat_path(pub_id: chat_id), notice: flash[:success] ? nil : notice
  end

  def destroy
    chat = CoolId.locate(params[:chat_id])

    if chat
      chat.users.delete(current_user)
      chat.messages.joins(:images_blobs).where(user: current_user).distinct.destroy_all
      chat.messages.where(user: current_user).delete_all

      redirect_to chats_path, alert: "You left a chat", status: :see_other
    end
  end
end
