class Chat < ApplicationRecord
  has_many :chat_rooms, dependent: :destroy
  has_many :users, through: :chat_rooms, before_add: :skip_existing_user

  has_many :messages, dependent: :destroy

  private

  def skip_existing_user(user)
    throw(:abort) if users.include?(user)
  end
end
