class Message < ApplicationRecord
  include ActionView::Helpers::DateHelper
  include CoolId::Model
  cool_id prefix: "m", length: 8, id_field: :pub_id

  scope :ordered_by_creation, -> { includes(:user).order(:created_at) }

  belongs_to :chat
  belongs_to :user

  validate :not_marked_as_deleted
  validates :value, presence: true

  def as_json
    super.except("id", "chat_id", "user_id", "created_at", "updated_at").merge({
      user: user, created: created_at_time_in_words_to_now, updated: updated_at_time_in_words_to_now
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
end
