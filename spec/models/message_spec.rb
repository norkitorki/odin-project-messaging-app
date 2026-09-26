require 'rails_helper'

RSpec.describe Message, type: :model do
  fixtures :chats, :messages, :users

  it "should omit id, chat_id, user_id, created_at, updated_at from json output" do
    message = messages(:one)
    json = message.as_json
    expect(json).to include(
      "deleted" => message.deleted,
      "parent_id" => message.parent_id,
      "pub_id" => message.pub_id,
      "value" => message.value,
      user: message.user,
      chat: { pub_id: message.chat.pub_id, name: message.chat.name },
      created: message.created_at_time_in_words_to_now,
      updated: message.updated_at_time_in_words_to_now
    )
    expect(json).not_to include("id", "chat_id", "user_id", "created_at", "updated_at")
  end

  it "should not update if message is deleted" do
    message = messages(:deleted)
    expect { message.update!(value: "Am I deleted?") }.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Message marked as deleted")
  end

  it "should not create message for non included chat member" do
    expect { Message.create!(user: users(:two), chat: chats(:public), value: "A new message") }.to raise_error(
      ActiveRecord::RecordInvalid, "Validation failed: User is not a chat member"
    )
  end

  it "should assign chat_id to reply before creation" do
    message = messages(:one)
    expect(message.replies.new.chat_id).to eql(message.id)
  end

  describe "scope" do
    it "#ordered_by_creation should order messages by time of creation" do
      messages(:one).update(created_at: Time.now + 1.hour)
      messages(:two).update(created_at: Time.now + 30.minutes)
      expect(described_class.all).to match_array([ messages(:one), messages(:two), messages(:three), messages(:reply), messages(:deleted) ])
      expect(described_class.ordered_by_creation).to match_array([ messages(:deleted), messages(:reply), messages(:three), messages(:two), messages(:one) ])
    end

    it "#top should return messages without reply" do
      expect(described_class.top).to match_array([ messages(:one), messages(:two), messages(:three), messages(:deleted) ])
    end

    it "#sub should return replies" do
      expect(described_class.sub).to match_array([ messages(:reply) ])
    end

    it "#public_messages should return messages belonging to public chats" do
      expect(described_class.public_messages).to match_array([ messages(:one), messages(:reply) ])
    end
  end

  describe "#created_at_time_in_words_to_now" do
    it "should return created time in words" do
      message = messages(:one)
      message.update(created_at: Time.now + 24.minutes)
      expect(message.created_at_time_in_words_to_now).to eql("24 minutes ago")
    end
  end

  describe "#updated_at_time_in_words_to_now" do
    it "should return updated time in words" do
      message = messages(:one)
      message.update(updated_at: Time.now + 1.2.hour)
      expect(message.updated_at_time_in_words_to_now).to eql("about 1 hour ago")
    end
  end
end
