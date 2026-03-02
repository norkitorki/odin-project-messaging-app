class ChatRoom < ApplicationRecord
  belongs_to :chat
  belongs_to :user

  before_destroy :destroy_empty_chat

  private

  def destroy_empty_chat
    chat.destroy if chat.users.count <= 1
  end
end
