require 'rails_helper'

RSpec.describe "Chats", type: :request do
  fixtures :chats, :chat_rooms, :messages, :users

  describe "GET /chats" do
    before do
      sign_in(users(:two))
    end

    it "should define user accessible chats" do
      get chats_path

      expect(assigns(:chats)).to match_array([ chats(:public), chats(:public_two), chats(:private), chats(:three) ])
    end

    context "when user is signed out" do
      before do
        sign_out(users(:two))
      end

      it "should define public chats" do
        get chats_path

        expect(assigns(:chats)).to match_array([ chats(:public), chats(:public_two), chats(:three) ])
      end
    end
  end

  describe "GET /chats/:pub_id" do
    before do
      sign_in(users(:one))
    end

    it "should define chat messages" do
      get chat_path(pub_id: chats(:public).pub_id)

      expect(assigns(:messages)).to match_array([ messages(:one) ])
    end

    it "should define chat message replies" do
      reply = messages(:reply)
      get chat_path(pub_id: chats(:public).pub_id)

      expect(assigns(:replies)).to eq({ "#{reply.parent_id}" => [ reply ] })
    end

    it "should redirect to chats path when user is not authorized" do
      get chat_path(pub_id: chats(:private).pub_id)

      expect(flash[:alert]).to eql("You are unauthorized to view this chat")
      expect(response).to have_http_status(:redirect)
      expect(response).to redirect_to(chats_path)
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to chats path when chat is private" do
        get chat_path(pub_id: chats(:private).pub_id)

        expect(flash[:alert]).to eql("You are unauthorized to view this chat")
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(chats_path)
      end
    end

    context "when :message param is passed" do
      it "should redirect to chat_path with :m and :page params" do
        message = messages(:one)
        get chat_path(pub_id: chats(:public).pub_id, message: message.pub_id)

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(chat_path(pub_id: chats(:public).pub_id, m: message.pub_id, page: 1))
      end
    end

    context "when :message and :parent params are passed" do
      it "should redirect to chat_path with :m, :p and :page params" do
        chat = chats(:public)
        admin = chat.admin
        65.times { |i| chat.messages.create!(user: admin, value: "Message ##{i}") }
        message = chat.messages.last.replies.create!(user: admin, value: "My reply")
        parent_id = message.parent_id
        get chat_path(pub_id: chat.pub_id, message: message.pub_id, parent: parent_id)

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(chat_path(pub_id: chats(:public).pub_id, m: message.pub_id, p: parent_id, page: 3))
      end
    end
  end

  describe "POST /chats/create" do
    before do
      sign_in(users(:one))
    end

    it "should create and redirect to chat" do
      expect { post create_chat_path(chat: { name: "My New Chat. Come and join!", private: false }) }.to change { Chat.count }.by(1)
      user = users(:one)
      created_chat = user.chats.find_by(pub_id: assigns(:chat).pub_id)

      expect(created_chat.admin).to eql(user)
      expect(created_chat.users).to match_array([ user ])
      expect(flash[:notice]).to eql("Chat created")
      expect(response).to redirect_to(chat_path(pub_id: created_chat.pub_id))
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        post create_chat_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when chat validation fails" do
      it "should render new template" do
        expect(post create_chat_path(chat: { name: nil, private: false })).to render_template("new")
        chat = assigns(:chat)
        expect(chat.admin).to eql(users(:one))
        expect(chat.users).to match_array([ users(:one) ])
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /chats/delete" do
    before do
      sign_in(users(:one))
    end

    it "should delete a chat" do
      chat = chats(:public)

      expect { delete delete_chat_path(chat_id: chat.pub_id) }.to change { chat.admin.created_chats.count }.by(-1)
      expect(flash[:alert]).to eql("Chat deleted")
      expect(response).to redirect_to(chats_path)
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        delete delete_chat_path(chat_id: chats(:public).pub_id)

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when trying to delete a chat not belonging to user" do
      it "should not delete the chat" do
        chat = chats(:private)

        expect { delete delete_chat_path(chat_id: chat.pub_id) }.not_to change { chat.admin.created_chats.count }
        expect(flash[:alert]).to eql("Chat could not be found")
        expect(response).to redirect_to(chats_path)
      end
    end
  end

  describe "GET /chats/:chat_id/users" do
    it "should define users and chat_data" do
      chat = chats(:three)
      get users_path(chat_id: chat.pub_id)

      expect(assigns(:users)).to match_array([ users(:three), users(:one), users(:two) ])
      expect(assigns(:chat_data)).to eql({ name: chat.name, path: chat_path(pub_id: chat.pub_id) })
    end
  end
end
