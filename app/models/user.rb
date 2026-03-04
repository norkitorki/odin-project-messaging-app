class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable

  include CoolId::Model
  cool_id prefix: "u", length: 8, id_field: :pub_id

  validates :username, presence: true, uniqueness: true
  validates :password, presence: true
  validates :password_confirmation, presence: true
  validate :passwords_match

  has_many :chat_rooms, dependent: :destroy
  has_many :chats, through: :chat_rooms

  has_many :messages, dependent: :destroy

  has_and_belongs_to_many :contacts,
    class_name: "User",
    join_table: :contacts,
    foreign_key: :user_id,
    association_foreign_key: :contact_id,
    before_add: :validate_contact

  before_destroy :destroy_contacts

  def remove_contact(user)
    return if !user.is_a?(self.class) || user == self

    Contact.where(user_id: id, contact_id: user.id).or(Contact.where(user_id: user.id, contact_id: id)).destroy_all
  end

  def as_json
    super.except("id", "created_at", "updated_at")
  end

  private

  def passwords_match
    errors.add(:passwords, "do not match") if password != password_confirmation
  end

  def validate_contact(user)
    throw(:abort) if user == self || contacts.include?(user)

    Contact.create!(user_id: user.id, contact_id: id)
  end

  def destroy_contacts
    Contact.where(user_id: id).or(Contact.where(contact_id: id)).destroy_all
  end
end
