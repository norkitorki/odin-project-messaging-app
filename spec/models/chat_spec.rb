require 'rails_helper'

RSpec.describe Chat, type: :model do
  fixtures :chats, :chat_rooms, :requests, :users

  it "should omit id, admin_id, created_at, updated_at from json output" do
    chat = chats(:public)
    json = chat.as_json
    expect(json).to include("name" => chat.name, "private" => chat.private, "pub_id" => chat.pub_id, admin: chat.admin)
    expect(json).not_to include("id", "admin_id", "created_at", "updated_at")
  end

  it "should not add existing user to chat" do
    chat = chats(:public)
    user = users(:one)
    expect(chat.users.include?(user)).to be_truthy
    expect { chat.users << user }.not_to change { chat.users.count }
  end

  it "should not allow removal of admin" do
    chat = chats(:public)
    admin = users(:one)
    expect(chat.admin).to eql(admin)
    expect { chat.users.delete(admin) }.not_to change { chat.users.count }
  end

  it "should delete associated requests upon deletion" do
    chat = chats(:private)
    expect(requests(:chat).reference_pub_id).to eql(chat.pub_id)
    expect { chat.destroy }.to change { Request.count }.from(2).to(1)
  end

  describe "scope" do
    it "#ordered_by_activity should order chats by updated_at in descending order" do
      chats(:private).update(updated_at: Time.now + 1.hour)
      expect(Chat.ordered_by_activity).to eq(Chat.order(updated_at: :desc))
    end
  end

  describe "self#available_to_user" do
    it "should return all user accessible chats" do
      expect(Chat.available_to_user(users(:two))).to match_array([ chats(:public), chats(:public_two), chats(:private), chats(:three) ])
      expect(Chat.available_to_user(users(:one))).to match_array([ chats(:public), chats(:public_two), chats(:three) ])
    end
  end

  describe "#message_images" do
    fixtures :messages

    let(:chat) { chats(:public) }
    let(:message) { chat.messages.first }

    before do
      image_1 = file_fixture("image-1.png")
      image_2 = file_fixture("image-2.png")
      message.images.attach(image_1, image_2)
    end

    it "should return all images belonging to chat messages" do
      first_image = message.images.first
      second_image = message.images.last
      expect(chat.message_images). to eq({
        "#{message.pub_id}" => {
          previews: [ {
            url: Rails.application.routes.url_helpers.rails_blob_path(first_image.variant(:preview), disposition: "attachment", only_path: true),
            filename: first_image.filename,
            key: first_image.key
          }, {
            url: Rails.application.routes.url_helpers.rails_blob_path(second_image.variant(:preview), disposition: "attachment", only_path: true),
            filename: second_image.filename,
            key: second_image.key
          } ],
          full: [
            Rails.application.routes.url_helpers.rails_blob_path(first_image, disposition: "attachment", only_path: true),
            Rails.application.routes.url_helpers.rails_blob_path(second_image, disposition: "attachment", only_path: true)
          ]
        }
      })
    end
  end

  describe "#json_with_user_count" do
    it "should include user count in json output" do
      chat = chats(:three)
      json = chat.as_json
      expect(chat.json_with_user_count).to eq({ userCount: chat.users.count }.merge(json))
    end
  end

  describe "#json_with_images" do
    let(:chat) { chats(:three) }

    before do
      allow(chat).to receive(:message_images).once.and_return({ images: true })
    end

    it "should include message images and user count in json output" do
      json = chat.as_json
      expect(chat.json_with_images).to eq({ images: { images: true }, userCount: chat.users.count }.merge(json))
    end
  end
end
