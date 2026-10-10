require 'rails_helper'

RSpec.describe "Users::Registrations", type: :request do
  fixtures :chats, :requests, :users

  describe "POST /user/signup" do
    it "should create a new user" do
      expect { post new_user_registration_path(user: { username: 'testuser11', password: '***', password_confirmation: '***' }) }.to change { User.count }.by(1)
      expect(flash[:notice]).to eql("Signed up successfully")
      expect(response).to have_http_status(:see_other)
      expect(response).to redirect_to(root_path)
    end

    context "when user does not pass validation" do
      it "should not create a new user" do
        expect { post new_user_registration_path(user: {}) }.not_to change { User.count }
        user = assigns(:user)
        expect(user).to be_new_record
        expect(user.errors.full_messages).to match_array([ "Username can't be blank", "Password can't be blank", "Password confirmation can't be blank" ])
        expect(flash.now[:alert]).to eql("User could not be created")
        expect(response).to render_template("users/new")
      end
    end
  end

  describe "PUT /user/update" do
    before do
      user = User.create!(username: "testuser101", password: "pass", password_confirmation: "pass")
      sign_in(user)
    end

    it "should update a user" do
      user = User.find_by(username: "testuser101")

      expect { put update_user_path(user: { username: "testuser443", password: "pass", current_password: "pass", password_confirmation: "pass" }) }
        .to change { User.find(user.id).username }.to("testuser443")
      expect(flash[:notice]).to eql("User has been successfully updated")
      expect(response).to redirect_to(edit_user_path(u: true))
    end

    context "when user does not pass validation" do
      it "should not update a user" do
        user = User.find_by(username: "testuser101")

        expect { put update_user_path(user: { username: "testuser443" }) }.to_not change { User.find(user.id) }
        expect(flash.now[:alert]).to eql("User could not be updated")
        expect(response).to render_template("users/edit")
      end

      it "should define user created public chats" do
        user = users(:two)
        sign_in(user)
        chats = user.created_chats.where(private: false)
        put update_user_path(user: { username: nil })

        expect(assigns(:public_chats)).to match_array(chats)
        expect(assigns(:public_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: chats.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(public_chat_page: 1) } ] })
      end

      it "should define user created private chats" do
        user = users(:two)
        sign_in(user)
        chats = user.created_chats.where(private: true)
        put update_user_path(user: { username: nil })

        expect(assigns(:private_chats)).to match_array(chats)
        expect(assigns(:private_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: chats.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(private_chat_page: 1) } ] })
      end

      it "should define received user requests" do
        user = users(:one)
        sign_in(user)
        requests = user.requests
        put update_user_path(user: { username: nil })

        expect(assigns(:requests)).to match_array(requests)
        expect(assigns(:request_pages)).to eql({ current: 1, previous: nil, count: 1, totalCount: requests.count, perPage: 10, paths: [ { page: 1, url: edit_user_path(request_page: 1) } ] })
      end

      it "should define errors" do
        put update_user_path(form_action: "user_form", user: { username: "testuser443" })

        expect(assigns(:errors)).to eql({ user_form: {
          password: [ "Password can't be blank" ],
          password_confirmation: [ "Password confirmation can't be blank" ],
          current_password: [ "Current password can't be blank" ]
        } })
      end
    end
  end

  describe "DELETE /user" do
    before do
      sign_in(users(:one))
    end

    it "should delete a user" do
      expect { delete destroy_user_path }.to change { User.count }.by(-1)
      expect(flash[:alert]).to eql("User successfully deleted")
      expect(response).to redirect_to(root_path)
    end
  end
end
