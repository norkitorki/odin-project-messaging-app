class PrivateMessage < ApplicationRecord
  include TimeHelper
  include CoolId::Model
  cool_id prefix: "p", length: 8, id_field: :pub_id

  belongs_to :receiver,
    class_name: "User"
  belongs_to :initiator,
    class_name: "User"

  validates :value, presence: true

  def as_json
    super.except("id", "receiver_id", "initiator_id", "created_at", "updated_at").merge({
      initiator: initiator,
      created: created_at_time_in_words_to_now
    })
  end
end
