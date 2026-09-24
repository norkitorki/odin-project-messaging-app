class Chat < ApplicationRecord
  include CoolId::Model
  cool_id prefix: "c", length: 8, id_field: :pub_id

  scope :ordered_by_activity, -> { order(updated_at: :desc) }

  validates :name, presence: true, uniqueness: true

  has_many :chat_rooms, dependent: :destroy_async
  has_many :users, through: :chat_rooms, before_add: :skip_existing_user, before_remove: :prevent_admin_removal
  has_many :messages, dependent: :destroy_async

  belongs_to :admin, class_name: "User"

  before_destroy :delete_associated_requests

  def self.available_to_user(user)
    self.joins(:users).where(private: false).or(Chat.where(users: user))
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

  def as_json
    super.except("id", "admin_id", "created_at", "updated_at").merge({ admin: admin })
  end

  def json_with_user_count
    as_json.merge({ userCount: users.count })
  end

  def json_with_images
    as_json.merge({ images: message_images, userCount: users.count })
  end

  private

  def skip_existing_user(user)
    throw(:abort) if users.include?(user)
  end

  def prevent_admin_removal(user)
    throw(:abort) if admin == user
  end

  def delete_associated_requests
    Request.where(reference_pub_id: pub_id).destroy_all
  end
end
