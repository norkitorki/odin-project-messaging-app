class Message < ApplicationRecord
  include ActionView::Helpers::DateHelper
  include CoolId::Model
  cool_id prefix: "m", length: 8, id_field: :pub_id

  IMAGE_CONTENT_TYPES = %w[ image/png image/jpeg ].freeze

  scope :ordered_by_creation, -> { order(:created_at) }
  scope :top, -> { where(parent_id: nil) }
  scope :sub, -> { where.not(parent_id: nil) }
  scope :public_messages, -> { includes(:chat, :user).where(chat: { private: false }) }

  belongs_to :chat, touch: true
  belongs_to :user, touch: true

  has_many_attached :images do |attachable|
    attachable.variant :preview, resize_to_limit: [ 75, 75 ]
  end

  has_many :replies,
    -> { order(:created_at) },
    class_name: "Message",
    primary_key: :pub_id,
    foreign_key: :parent_id,
    dependent: :destroy_async,
    before_add: :set_chat_id

  validate :not_marked_as_deleted
  validate :user_is_chat_member
  validates :value, presence: true
  validates :images, content_type: IMAGE_CONTENT_TYPES, size: { less_than: 3.megabytes }

  def as_json
    super.except("id", "chat_id", "user_id", "created_at", "updated_at").merge({
      user: user,
      chat: { pub_id: chat.pub_id, name: chat.name },
      created: created_at_time_in_words_to_now,
      updated: updated_at_time_in_words_to_now
    })
  end

  def created_at_time_in_words_to_now
    "#{distance_of_time_in_words_to_now(created_at)} ago"
  end

  def updated_at_time_in_words_to_now
    "#{distance_of_time_in_words_to_now(updated_at)} ago"
  end

  private

  def not_marked_as_deleted
    errors.add(:message, "marked as deleted") if deleted
  end

  def user_is_chat_member
    errors.add(:user, "is not a chat member") unless chat.users.include?(user)
  end

  def set_chat_id(message)
    message.chat = chat
  end
end
