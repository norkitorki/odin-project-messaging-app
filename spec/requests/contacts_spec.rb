require 'rails_helper'

RSpec.describe "Contacts", type: :request do
  fixtures :contacts, :users

  describe "POST /contacts/add" do
    before do
      sign_in(users(:one))
    end

    it "should create contact" do
      contact = users(:three)
      path = edit_user_path

      expect { post add_contact_path, params: { user_id: contact.pub_id }, headers: { referer: path } }.to change { users(:one).contacts.count }.by(1).and change { contact.contacts.count }.by(1)
      expect(flash[:notice]).to eql("#{contact.username} was added to your contacts")
      expect(response).to redirect_to(edit_user_path)
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        post add_contact_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when contact already exists" do
      it "should not create contact" do
        user = users(:one)
        contact = users(:two)

        expect(user.contacts).to include(contact)
        expect { post add_contact_path(user_id: contact.pub_id) }.not_to change { users(:one).contacts.count }
        expect(contact.contacts.count).to eql(1)
        expect(flash[:alert]).to eql("#{contact.username} was not added to your contacts")
        expect(response).to redirect_to(root_path)
      end
    end
  end

  describe "DELETE /contacts/remove" do
    before do
      sign_in(users(:one))
    end

    it "should remove a contact" do
      contact = users(:two)
      path = user_path(pub_id: contact.pub_id)

      expect { delete remove_contact_path, params: { user_id: contact.pub_id }, headers: { referer: path } }.to change { users(:one).contacts.count }.by(-1)
      expect(flash[:notice]).to eql("#{contact.username} has been removed from your contacts")
      expect(response).to redirect_to(path)
    end

    context "when user is signed out" do
      before do
        sign_out(users(:one))
      end

      it "should redirect to new_user_session path" do
        delete remove_contact_path

        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(new_user_session_path)
      end
    end

    context "when contact does not exist" do
      it "should redirect back" do
        contact = users(:three)
        path = chats_path

        expect { delete remove_contact_path, params: { user_id: contact.pub_id }, headers: { referer: path } }.not_to change { users(:one).contacts.count }
        expect(flash[:notice]).to eql("#{contact.username} has not been removed from your contacts")
        expect(response).to redirect_to(path)
      end
    end
  end
end
