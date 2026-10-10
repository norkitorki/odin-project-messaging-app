require 'rails_helper'

RSpec.describe "Users::Avatars", type: :request do
  fixtures :users

  describe "DELETE /user/avatar" do
    before do
      sign_in(users(:one))
    end

    it "should delete a user's avatar" do
      user = users(:one)
      user.avatar.attach(file_fixture("image-1.png"))
      user.avatar.update(id: 1)

      expect(user.avatar.attached?).to eql(true)
      expect { delete delete_avatar_path }.to change { user.avatar.attached? }.to(false)
      expect(flash[:alert]).to eql("Avatar has been deleted")
      expect(response).to redirect_to(edit_user_path)
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        delete delete_avatar_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when user has no avatar attached" do
      it "should redirect back" do
        path = chats_path
        delete delete_avatar_path, headers: { referer: path }

        expect(flash[:alert]).to eql("No avatar to delete")
        expect(response).to redirect_to(path)
      end
    end
  end
end
