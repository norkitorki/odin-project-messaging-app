class User < ApplicationRecord
  include TimeHelper
  include CoolId::Model
  cool_id prefix: "u", length: 8, id_field: :pub_id

  devise :database_authenticatable, :registerable, :rememberable

  IMAGE_CONTENT_TYPES = %w[ image/png image/jpeg ].freeze

  scope :ordered_by_username, -> { order(:username) }

  validates :username, presence: true, uniqueness: true
  validates :password, presence: true
  validates :password_confirmation, presence: true
  validate :passwords_match

  has_one_attached :avatar

  has_many :chat_rooms, dependent: :destroy_async
  has_many :chats, through: :chat_rooms
  has_many :created_chats,
    class_name: "Chat",
    foreign_key: :admin_id,
    dependent: :destroy

  has_many :messages, dependent: :destroy_async

  has_many :requests,
    class_name: "Request",
    foreign_key: :receiver_id,
    dependent: :destroy

  has_many :initiated_requests,
    class_name: "Request",
    foreign_key: :initiator_id,
    dependent: :destroy

  has_and_belongs_to_many :contacts,
    class_name: "User",
    join_table: :contacts,
    foreign_key: :user_id,
    association_foreign_key: :contact_id,
    after_add: :create_opposite_contact

  validates :avatar, content_type: IMAGE_CONTENT_TYPES, size: { less_than: 1.megabytes }

  before_destroy :destroy_contacts

  def available_chats
    Chat.joins(:users).where(private: false).or(Chat.where(users: self)).distinct
  end

  def remove_contact(user)
    return if !user.is_a?(self.class) || user == self

    removal = Contact.where(user_id: id, contact_id: user.id).or(Contact.where(user_id: user.id, contact_id: id)).destroy_all
    !removal.empty?
  end

  def as_json
    avatar_obj = { avatar: { url: Rails.application.routes.url_helpers.rails_blob_path(avatar, disposition: "attachment", only_path: true), filename: avatar.filename.to_s } } if avatar.attached?
    super.merge(avatar_obj || {}).except("id", "created_at")
  end

  private

  def passwords_match
    errors.add(:password_confirmation, "doesn't match password") if password != password_confirmation
  end

  def create_opposite_contact(user)
    Contact.create!(user_id: user.id, contact_id: id)
  end

  def destroy_contacts
    Contact.where(user_id: id).or(Contact.where(contact_id: id)).destroy_all
  end
end
