class Chat < ApplicationRecord
  include CoolId::Model
  cool_id prefix: "c", length: 8, id_field: :pub_id

  has_many :chat_rooms, dependent: :destroy
  has_many :users, through: :chat_rooms, before_add: :skip_existing_user

  has_many :messages, dependent: :destroy

  private

  def skip_existing_user(user)
    throw(:abort) if users.include?(user)
  end
end
