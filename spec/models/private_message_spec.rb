require 'rails_helper'

RSpec.describe PrivateMessage, type: :model do
  fixtures :private_messages

  it "should omit id, receiver_id, initiator_id, created_at, updated_at from json output" do
    message = private_messages(:one)
    json = message.as_json
    expect(json).to include(
      "value" => message.value,
      "pub_id" => message.pub_id,
      initiator: message.initiator,
      created: message.created_at_time_in_words_to_now
    )
    expect(json).not_to include("id", "receiver_id", "initiator_id", "created_at", "updated_at")
  end
end
