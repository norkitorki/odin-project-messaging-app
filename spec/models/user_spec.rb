require 'rails_helper'

RSpec.describe User, type: :model do
  fixtures :chats, :contacts, :users

  it "should omit id, created_at from json output" do
    user = users(:one)
    json = user.as_json
    expect(json).to include({
      "username" => user.username,
      "pub_id" => user.pub_id,
      "updated_at" => user.updated_at.to_json.gsub("\"", "")
    })
  end

  it "should not validate when username is not unique" do
    expect { User.create!(
      username: users(:one).username,
      password: "pass",
      password_confirmation: "pass"
    )}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Username has already been taken")
  end

  it "should not validate when password and password_confirmation are not present" do
    expect { User.create!(username: 'johnny243') }.to raise_error(
      ActiveRecord::RecordInvalid, "Validation failed: Password can't be blank, Password confirmation can't be blank"
    )
  end

  it "should not validate when passwords do not match" do
    expect { User.create!(
      username: 'sarah44',
      password: 'myPass',
      password_confirmation: 'myOtherPass'
    )}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Password confirmation doesn't match password")
  end

  it "should create contact for receiving user" do
    Contact.destroy_all
    john = users(:one)
    jane = users(:two)
    expect { john.contacts << jane }.to change { Contact.count }.by(2)
    expect(john.contacts).to include(jane)
    expect(jane.contacts).to include(john)
  end

  it "should delete orphaned contacts before deletion" do
    user = users(:one)
    expect((Contact.where(user_id: user.id).or(Contact.where(contact_id: user.id)).count)).to eql(2)
    user.destroy
    expect((Contact.where(user_id: user.id).or(Contact.where(contact_id: user.id)).count)).to eql(0)
  end

  it "should delete orphaned user created chats before deletion" do
    user = users(:one)
    expect { user.destroy }.to change { user.created_chats.count }.from(2).to(0)
  end

  describe("scope") do
    it "#ordered_by_username should order users by username" do
      expect(User.ids).to eq([ 1, 2, 3 ])
      expect(User.ordered_by_username.ids).to eq([ 3, 2, 1 ])
    end
  end

  describe("#available_chats") do
    it "should return chats accessible by the user" do
      expect(users(:one).available_chats).to match_array([ chats(:public), chats(:three) ])
      expect(users(:two).available_chats).to match_array([ chats(:public), chats(:private), chats(:three) ])
    end
  end

  describe("#remove_contact") do
    it "should remove a contact" do
      expect(Contact.count).to eql(2)
      contact_removal = users(:one).remove_contact(users(:two))
      expect(Contact.count).to eql(0)
      expect(contact_removal).to eql(true)
    end
  end

  describe("#created_chats") do
    it "should return user created chats" do
      expect(users(:one).created_chats).to match_array([ chats(:public), chats(:three) ])
      expect(users(:two).created_chats).to match_array([ chats(:private) ])
    end
  end

  context "when avatar is attached" do
    let(:avatar) { file_fixture("image-1.png") }

    before do
      users(:one).avatar.attach(avatar)
      users(:one).avatar.blob.update(id: 1)
    end

    it "should include avatar in json output" do
      user = users(:one)
      expect(user.as_json).to include(
        avatar: { url: Rails.application.routes.url_helpers.rails_blob_path(user.avatar, disposition: "attachment", only_path: true), filename: user.avatar.filename.to_s }
      )
    end
  end
end
