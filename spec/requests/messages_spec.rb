require 'rails_helper'

RSpec.describe "Messages", type: :request do
  fixtures :chats, :chat_rooms, :messages, :users

  describe "POST /messages/add" do
    before do
      sign_in(users(:one))
    end

    it "should create message" do
      user = users(:one)
      chat = chats(:three)

      expect { post add_message_path(chat_id: chat.pub_id, message: { value: "Hello!" }) }.to change { chat.messages.count }.by(1).and change { user.messages.count }.by(1)
      expect(flash[:notice]).to eql("Message saved")
      expect(response).to redirect_to(chat_path(pub_id: chat.pub_id, params: { message: chat.messages.last.pub_id }))
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        post add_message_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when message.parent_id is provided" do
      it "should create a reply" do
        user = users(:one)
        chat = chats(:public)
        parent = chat.messages.first

        expect { post add_message_path(chat_id: chat.pub_id, message: { value: "Hello!", parent_id: parent.pub_id }) }.to change { chat.messages.count }.by(1).and change { user.messages.count }.by(1)
        expect(flash[:notice]).to eql("Message saved")
        message = chat.messages.last
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id, params: { message: message.pub_id, parent: parent.pub_id }))
        expect(message.parent_id).to eql(parent.pub_id)
      end
    end

    context "when message does not validate" do
      it "should redirect to chat" do
        chat = chats(:public)

        expect { post add_message_path(chat_id: chat.pub_id, message: { value: nil }) }.not_to change { chat.messages.count }
        expect(flash[:alert]).to eql("Message could not be saved")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end
    end

    context "when user is not a chat member" do
      before do
        sign_in(users(:three))
        chats(:three).users.delete(users(:three))
      end

      it "should redirect back" do
        user = users(:three)
        chat = chats(:three)
        path = user_path(pub_id: user.pub_id)

        expect { post add_message_path, params: { chat_id: chat.pub_id, message: { value: "Hey there!" } }, headers: { referer: path } }.not_to change { chat.messages.count }
        expect(flash[:alert]).to eql("You are not a member of this chat")
        expect(response).to redirect_to(path)
      end
    end
  end

  describe "PATCH /messages/update" do
    before do
      sign_in(users(:one))
    end

    it "should update message" do
      user = users(:one)
      message = messages(:one)
      chat = message.chat
      path = chat_path(pub_id: chat.pub_id)
      patch update_message_path, params: { message_id: message.pub_id, message: { value: "New updated value" } }, headers: { referer: path }

      expect(user.messages.find(message.id).value).to eql("New updated value")
      expect(flash[:notice]).to eql("Message updated")
      expect(response).to redirect_to(chat_path(pub_id: chat.pub_id, message: message.pub_id))
    end

    it "should update reply" do
      user = users(:one)
      message = messages(:reply)
      chat = message.chat
      path = chat_path(pub_id: chat.pub_id)
      patch update_message_path, params: { message_id: message.pub_id, message: { value: "update reply" } }, headers: { referer: path }

      expect(user.messages.find(message.id).value).to eql("update reply")
      expect(flash[:notice]).to eql("Message updated")
      expect(response).to redirect_to(chat_path(pub_id: chat.pub_id, message: message.pub_id, parent: message.parent_id))
    end

    it "should not update when message does not validate" do
      user = users(:one)
      message = messages(:one)
      chat = message.chat
      path = chat_path(pub_id: chat.pub_id)
      patch update_message_path, params: { message_id: message.pub_id, message: { value: nil } }, headers: { referer: path }

      expect(user.messages.find(message.id).value).to eql(message.value)
      expect(flash[:notice]).to eql("Message not updated")
      expect(response).to redirect_to(chat_path(pub_id: chat.pub_id, message: message.pub_id))
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        patch update_message_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when destroy param is provided" do
      it "should mark message as deleted" do
        message = messages(:one)
        path = path = chat_path(pub_id: chats(:public).pub_id)
        patch update_message_path, params: { message_id: message.pub_id, destroy: 1 }, headers: { referer: path }
        message = users(:one).messages.find(message.id)

        expect(message.value).to eql("Message removed by Admin")
        expect(message.deleted).to eql(true)
        expect(flash[:alert]).to eql("Message deleted by Admin")
        expect(response).to redirect_to(path)
      end

      it "should delete attached images" do
        message = messages(:one)
        message.images.attach(file_fixture("image-1.png"), file_fixture("image-2.png"))

        expect(message.images.attached?).to eql(true)
        patch update_message_path(message_id: message.pub_id, destroy: 1)
        expect(users(:one).messages.find(message.id).images.attached?).to eql(false)
      end
    end

    context "when images param is provided" do
      it "should delete images" do
        message = messages(:one)
        message.images.attach(file_fixture("image-1.png"), file_fixture("image-2.png"))

        expect(message.images.count).to eql(2)
        patch update_message_path(message_id: message.pub_id, message: { images: [ message.images.first.key ] })
        expect(message.images.count).to eql(1)
      end
    end

    context "when message could not be found" do
      it "should redirect back" do
        path = chat_path(pub_id: chats(:public).pub_id)
        patch update_message_path, params: { message_id: "u_invalidid" }, headers: { referer: path }

        expect(flash[:alert]).to eql("Message could not be found")
        expect(response).to redirect_to(path)
      end
    end
  end
end
