class Contact < ApplicationRecord
  belongs_to :user
  belongs_to :contact, class_name: "User"

  validate :valid_contact

  private

  def valid_contact
    if user_id == contact_id
      errors.add(:contact, "cannot be user")
    elsif user.contacts.include?(contact)
      errors.add(:contact, "already exists")
    end
  end
end
