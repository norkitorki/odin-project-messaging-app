require 'rails_helper'

RSpec.describe "ChatMembers", type: :request do
  fixtures :chats, :chat_rooms, :users

  describe "POST /chat/join" do
    context "when user is signed out" do
      it "should redirect to new_user_session path" do
        chat = chats(:public)
        post join_chat_path(chat_id: chat.pub_id)

        expect(flash[:alert]).to eql("You need to sign in or sign up before continuing.")
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user is signed in" do
      before do
        sign_in(users(:one))
      end

      it "should redirect to chat when chat is private" do
        chat = chats(:private)
        post join_chat_path(chat_id: chat.pub_id)

        expect(flash[:alert]).to eql("Unable to join a private chat")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end

      it "should redirect to chat when user is already a chat member" do
        chat = chats(:public)
        post join_chat_path(chat_id: chat.pub_id)

        expect(flash[:alert]).to eql("You are already a member")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end

      it "should add user as a chat member" do
        user = users(:two)
        chat = chats(:public)
        sign_in(user)
        post join_chat_path(chat_id: chat.pub_id)

        expect(chat.users).to include(user)
        expect(flash[:notice]).to eql("You joined the chat")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end
    end
  end

  describe "DELETE /chat/leave" do
    context "when user is signed out" do
      it "should redirect to new_user_session path" do
        chat = chats(:public)
        delete leave_chat_path(chat_id: chat.pub_id)

        expect(flash[:alert]).to eql("You need to sign in or sign up before continuing.")
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user is signed in" do
      let(:chat) { chats(:three) }

      before do
        sign_in(users(:three))
      end

      it "should remove user as chat member" do
        expect { delete leave_chat_path(chat_id: chat.pub_id) }.to change { chat.users.count }.by(-1)
        expect(flash[:alert]).to eql("You left a chat")
        expect(response).to redirect_to(chats_path)
      end

      it "should delete message images belonging to user" do
        message = chat.messages.create!(value: "New Message", user: users(:three))
        message.images.attach(file_fixture("image-1.png"))

        expect(message.images.attached?).to eql(true)
        expect { delete leave_chat_path(chat_id: chat.pub_id) }.to change { message.images.count }.by(-1)
        expect(flash[:alert]).to eql("You left a chat")
        expect(response).to redirect_to(chats_path)
      end

      it "should delete chat messages belonging to user" do
        user = users(:three)
        [ "First Message", "Second Message" ].each { |val| chat.messages.create!(value: val, user: user) }

        expect(chat.messages.count).to eql(2)
        expect { delete leave_chat_path(chat_id: chat.pub_id) }.to change { chat.messages.count }.by(-2)
        expect(flash[:alert]).to eql("You left a chat")
        expect(response).to redirect_to(chats_path)
      end
    end
  end
end
