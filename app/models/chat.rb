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

  before_destroy :delete_associated_requests

  def self.open(*users)
    return nil if users.empty?

    user_ids = users.map(&:id).uniq
    user_ids_sorted = user_ids.sort.join(",")

    shared_chats = Chat.joins(:users).where(users: user_ids).group(:id).having("count(users.id) = ?", user_ids.length)
    existing_chat = shared_chats.find { |chat| chat.users.ids.sort.join(",") == user_ids_sorted }
    existing_chat || Chat.create!(users: users, admin: users.first)
  end

  def as_json
    super.except("id", "admin_id", "updated_at").merge({ admin: admin, users: users })
  end

  def json_with_messages
    as_json.merge({ messages: messages.includes(:user).ordered_by_creation, images: message_images })
  end

  private

  def skip_existing_user(user)
    throw(:abort) if users.include?(user)
  end

  def delete_associated_requests
    Request.where(reference_pub_id: pub_id).destroy_all
  end

  def message_images
    store = {}
    messages.joins(:images_blobs).preload(:images_blobs).distinct.each do |message|
      obj = { previews: [], full: [] }
      message.images.each do |image|
        obj[:previews] << {
          url: Rails.application.routes.url_helpers.rails_blob_path(image.variant(:preview), disposition: "attachment", only_path: true),
          filename: image.filename.to_s,
          key: image.key
        }
        obj[:full] << Rails.application.routes.url_helpers.rails_blob_path(image, disposition: "attachment", only_path: true)
      end
      store[message.pub_id] = obj
    end
    store
  end
end
