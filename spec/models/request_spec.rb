require 'rails_helper'

RSpec.describe Request, type: :model do
  include ActionView::Helpers::DateHelper

  fixtures :requests, :users

  it "should omit id, initiator_id, receiver_id, updated_at from json output" do
    request = requests(:chat)
    json = request.as_json
    expect(json).to include({
      initiator: request.initiator,
      receiver: request.receiver,
      created: "#{distance_of_time_in_words_to_now(request.created_at)} ago"
    })
    expect(json).not_to include("id", "initiator_id", "receiver_id", "updated_at")
  end

  it "should not validate when initiator and receiver are equal" do
    user = users(:two)
    expect { Request.create!(initiator: user, receiver: user, request_type: "chat") }.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Initiator cannot be receiver")
  end
end
