require 'rails_helper'

RSpec.describe "Requests", type: :request do
  fixtures :chats, :chat_rooms, :contacts, :requests, :users

  before do
    sign_in(users(:two))
  end

  describe "GET /requests/:pub_id" do
    context "when user is signed out" do
      before do
        sign_out(users(:two))
      end

      it "should redirect to new_user_session path" do
        get request_path(pub_id: requests(:chat).pub_id)

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user is not authorized to see the request" do
      before do
        sign_in(users(:three))
      end

      it "should redirect back" do
        path = chats_path
        get request_path(pub_id: requests(:chat).pub_id), headers: { referer: path }

        expect(flash[:alert]).to eql("You are not authorized to see this request")
        expect(response).to redirect_to(path)
      end
    end
  end

  describe "POST /requests/add" do
    context "when user is signed out" do
      before do
        sign_out(users(:two))
      end

      it "should redirect to new_user_session path" do
        post add_request_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when request_type is invalid" do
      it "should redirect back" do
        path = user_path(pub_id: users(:two).pub_id)
        expect { post add_request_path(request_type: "video"), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("Invalid request type")
        expect(response).to redirect_to(path)
      end
    end

    context "when request_type is chat" do
      it "should create a new chat request" do
        chat = chats(:private)
        receiver = users(:three)
        expect { post add_request_path(request_type: :chat, receiver: receiver.username, chat_id: chat.pub_id) }.to change { Request.count }.by(1)

        request = receiver.requests.last
        expect(request.request_type).to eql("chat")
        expect(request.reference_pub_id).to eql(chat.pub_id)
        expect(flash[:notice]).to eql("Chat invite was sent")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end

      it "should redirect back when chat could not be found" do
        path = chats_path
        expect { post add_request_path(request_type: :chat, chat_id: "c_invalidid"), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("Chat could not be found")
        expect(response).to redirect_to(path)
      end

      it "should redirect back when user is not chat admin" do
        sign_in(users(:one))
        path = chats_path
        expect { post add_request_path(request_type: :chat, chat_id: chats(:private).pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("You are not authorized to invite users to this chat")
        expect(response).to redirect_to(path)
      end

      it "should redirect back when receiver is already a chat member" do
        chat = chats(:private)
        receiver = users(:one)
        chat.users << receiver
        path = chats_path
        expect { post add_request_path(request_type: :chat, receiver: receiver.username, chat_id: chat.pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("User is already a chat member")
        expect(response).to redirect_to(path)
      end

      it "should not create request if it already exists" do
        chat = chats(:private)
        receiver = requests(:chat).receiver
        expect { post add_request_path(request_type: :chat, receiver: receiver.username, chat_id: chat.pub_id) }.not_to change { Request.count }

        expect(flash[:notice]).to eql("Chat invite is still pending")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end

      it "should redirect back when receiver is not found" do
        path = chats_path
        expect { post add_request_path(request_type: :chat, receiver: "user_not_found", chat_id: chats(:private).pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("User could not be found")
        expect(response).to redirect_to(path)
      end
    end

    context "when request_type is friend" do
      it "should create a new friend request" do
        sign_in(users(:one))
        receiver = users(:three)
        path = user_path(pub_id: receiver.pub_id)
        expect { post add_request_path(request_type: :friend, receiver: receiver.pub_id), headers: { referer: path } }.to change { Request.count }.by(1)

        request = receiver.requests.last
        expect(request.request_type).to eql("friend")
        expect(request.initiator).to eql(users(:one))
        expect(flash[:notice]).to eql("Friend request was sent")
        expect(response).to redirect_to(path)
      end

      it "should redirect back when user is already a friend" do
        path = chats_path
        receiver = users(:one)
        expect { post add_request_path(request_type: :friend, receiver: receiver.pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("#{receiver.username} is already your friend")
        expect(response).to redirect_to(path)
      end

      it "should redirect to already existing friend request" do
        request = requests(:friend)
        sign_in(request.receiver)
        expect { post add_request_path(request_type: :friend, receiver: request.initiator.pub_id) }.not_to change { Request.count }

        expect(flash[:alert]).to eql("Friend request is already open")
        expect(response).to redirect_to(request_path(pub_id: request.pub_id))
      end

      it "should redirect back when user tries to befriend themselves" do
        path = chats_path
        expect { post add_request_path(request_type: :friend, receiver: requests(:friend).initiator.pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("You cannot befriend yourself")
        expect(response).to redirect_to(path)
      end

      it "should not create request if it already exists" do
        path = chats_path
        expect { post add_request_path(request_type: :friend, receiver: requests(:friend).receiver.pub_id), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:notice]).to eql("Friend request is still pending")
        expect(response).to redirect_to(path)
      end

      it "should redirect back when receiver is not found" do
        path = chats_path
        expect { post add_request_path(request_type: :friend, receiver: "u_invalidid"), headers: { referer: path } }.not_to change { Request.count }

        expect(flash[:alert]).to eql("User could not be found")
        expect(response).to redirect_to(path)
      end
    end
  end

  describe "PATCH /requests/update" do
    context "when user is signed out" do
      before do
        sign_out(users(:two))
      end

      it "should redirect to new_user_session path" do
        patch update_request_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user is not authorized to see the request" do
      it "should redirect back" do
        path = chats_path
        patch update_request_path(pub_id: requests(:chat).pub_id), headers: { referer: path }

        expect(flash[:alert]).to eql("You are not authorized to see this request")
        expect(response).to redirect_to(path)
      end
    end

    context "when request_type is chat" do
      before do
        sign_in(users(:one))
      end

      it "should add user as a chat member and delete request" do
        request = requests(:chat)
        chat = Chat.find_by(pub_id: request.reference_pub_id)

        expect { patch update_request_path(pub_id: request.pub_id, request_type: "chat", accept: true) }
          .to change { chat.users.count }.by(1)
          .and change { Request.count }.by(-1)
        expect(flash[:notice]).to eql("Chat request accepted")
        expect(response).to redirect_to(chat_path(pub_id: chat.pub_id))
      end
    end

    context "when request type is friend" do
      before do
        sign_in(users(:three))
      end

      it "should add user as a contact and delete request" do
        receiver = users(:three)
        expect { patch update_request_path(pub_id: requests(:friend).pub_id, request_type: "friend", accept: true) }
          .to change { receiver.contacts.count }.by(1)
          .and change { Request.count }.by(-1)
        expect(flash[:notice]).to eql("Friend request accepted")
        expect(response).to redirect_to(edit_user_path)
      end
    end

    context "when request is rejected" do
      before do
        sign_in(users(:one))
      end

      it "should delete request and redirect to edit_user_path" do
        request = requests(:chat)

        expect { patch update_request_path(pub_id: request.pub_id, request_type: request.request_type) }.to change { Request.count }.by(-1)
        expect(flash[:alert]).to eql("Chat request has been rejected")
        expect(response).to redirect_to(edit_user_path)
      end
    end
  end
end
