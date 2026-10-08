require 'rails_helper'

RSpec.describe "Users", type: :request do
  fixtures :contacts, :chats, :messages, :requests, :users

  describe "GET /sign_up" do
    it "should create new user instance" do
      get new_user_path

      expect(assigns(:user)).to be_new_record
      expect(assigns(:user).class).to eql(User)
    end
  end

  describe "GET /users/:pub_id" do
    it "should define new user instance" do
      user = users(:one)
      get user_path(pub_id: user.pub_id)

      expect(assigns(:user).pub_id).to eql(user.pub_id)
    end

    it "should define user created public chats" do
      user = users(:two)
      get user_path(pub_id: user.pub_id)

      chats = user.chats.where(private: false)
      expect(assigns(:chats)).to match_array(chats)
      expect(assigns(:chat_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: chats.count, perPage: 20, paths: [ { page: 1, url: user_path(pub_id: user.pub_id, c_page: 1) } ] })
    end

    it "should define user created public messages" do
      user = users(:two)
      get user_path(pub_id: user.pub_id)

      messages = user.messages.includes(:chat).where(chat: { private: false })
      expect(assigns(:messages)).to match_array(messages)
      expect(assigns(:message_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: messages.count, perPage: 20, paths: [ { page: 1, url: user_path(pub_id: user.pub_id, m_page: 1) } ] })
    end

    context "when user is signed in" do
      before do
        sign_in(users(:one))
      end

      it "should check if user is a contact" do
        user = users(:two)
        get user_path(pub_id: user.pub_id)

        expect(assigns(:userIsContact)).to eql(true)
      end
    end
  end

  describe "GET /user/settings" do
    before do
      sign_in(users(:one))
    end

    it "should define user created public chats" do
      get edit_user_path

      user = users(:one)
      chats = user.chats.where(private: false)
      expect(assigns(:public_chats)).to match_array(chats)
      expect(assigns(:public_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: chats.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(public_chat_page: 1) } ] })
    end

    it "should define user created private chats" do
      user = users(:two)
      sign_in(user)
      get edit_user_path

      chats = user.chats.where(private: true)
      expect(assigns(:private_chats)).to match_array(chats)
      expect(assigns(:private_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: chats.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(private_chat_page: 1) } ] })
    end

    it "should define received user requests" do
      user = users(:one)
      get edit_user_path

      requests = user.requests
      expect(assigns(:requests)).to match_array(requests)
      expect(assigns(:request_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: requests.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(request_page: 1) } ] })
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        get edit_user_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
