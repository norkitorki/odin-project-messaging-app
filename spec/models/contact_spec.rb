require 'rails_helper'

RSpec.describe Contact, type: :model do
  fixtures :contacts, :users

  it "should not pass validation when user and contact are equal" do
    user = users(:one)
    expect { Contact.create!(user: user, contact: user) }.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Contact cannot be user")
  end

  it "should not pass validation when contact already exists" do
    expect { Contact.create!(user: users(:one), contact: users(:two)) }.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Contact already exists")
  end
end
