class Chat < ApplicationRecord
  include CoolId::Model
  cool_id prefix: "c", length: 8, id_field: :pub_id

  has_many :chat_rooms, dependent: :destroy
  has_many :users,
    through: :chat_rooms,
    before_add: :skip_existing_user,
    after_remove: Proc.new { |chat| chat.destroy if chat.users.count < 1 }

  has_many :messages, dependent: :destroy

  belongs_to :admin, class_name: "User"

  def self.open(*users)
    return nil if users.empty?

    user_ids = users.map(&:id).uniq
    user_ids_sorted = user_ids.sort.join(",")

    shared_chats = Chat.joins(:users).where(users: user_ids).group(:id).having("count(users.id) = ?", user_ids.length)
    existing_chat = shared_chats.find { |chat| chat.users.ids.sort.join(",") == user_ids_sorted }
    existing_chat || Chat.create!(users: users, admin: users.first)
  end

  def as_json
    super.except("id", "admin_id").merge({ admin_id: admin.pub_id, users: users, messages: messages.ordered_by_creation })
  end

  private

  def skip_existing_user(user)
    throw(:abort) if users.include?(user)
  end
end
