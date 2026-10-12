require 'rails_helper'

RSpec.describe "Users::Sessions", type: :request do
  fixtures :users

  describe "POST /signin" do
    it "should sign in the user" do
      user = User.create!(username: "testuser", password: "myPass", password_confirmation: "myPass")
      post user_session_path(user: { username: user.username, password: "myPass" })

      expect(flash[:notice]).to eql("Signed in as #{user.username}")
      expect(response).to have_http_status(:see_other)
      expect(response).to redirect_to(root_path)
    end

    context "when user credentials are not found" do
      it "should redirect to root path" do
        post user_session_path(user: { username: "non_existent_user", password: "password" })

        expect(flash[:alert]).to eql("Unable to find user")
        expect(response).to redirect_to(root_path)
      end
    end
  end

  describe "DELETE /signout" do
    before do
      sign_in(users(:one))
    end

    it "should sign out user" do
      delete destroy_user_session_path

      expect(flash[:notice]).to eql("Signed out successfully")
      expect(response).to redirect_to(root_path)
    end
  end
end
