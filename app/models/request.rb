class Request < ApplicationRecord
  include ActionView::Helpers::DateHelper
  include CoolId::Model
  cool_id prefix: "r", length: 8, id_field: :pub_id

  belongs_to :initiator, class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :request_type, presence: true

  def as_json
    super.except("id", "initiator_id", "receiver_id", "updated_at").merge(
      { initiator: initiator, receiver: receiver, created: "#{distance_of_time_in_words_to_now(created_at)} ago" }
    )
  end
end
