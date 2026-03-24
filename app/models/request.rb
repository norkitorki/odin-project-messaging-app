class Request < ApplicationRecord
  include CoolId::Model
  cool_id prefix: "r", length: 16, id_field: :pub_id

  belongs_to :initiator, class_name: "User"
  belongs_to :receiver, class_name: "User"

  validates :request_type, presence: true

  def as_json
    super.except("id", "initiator_id", "receiver_id", "updated_at").merge({ initiator: initiator, receiver: receiver })
  end
end
