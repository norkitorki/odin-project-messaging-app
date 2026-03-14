class Message < ApplicationRecord
  include CoolId::Model
  cool_id prefix: "m", length: 8, id_field: :pub_id

  belongs_to :chat
  belongs_to :user

  def as_json
    super.except("id", "chat_id", "user_id", "updated_at")
  end
end
