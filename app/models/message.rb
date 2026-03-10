class Message < ApplicationRecord
  belongs_to :chat
  belongs_to :user

  def as_json
    super.except("id", "chat_id", "user_id", "updated_at")
  end
end
