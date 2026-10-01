class ContactsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contact

  def create
    contact = Contact.new(user: current_user, contact: @user)

    if contact.valid?
      current_user.contacts << @user
      redirect_back_or_to edit_user_path, notice: "#{@user.username} was added to your contacts"
    else
      redirect_to root_path, alert: "#{@user.username} was not added to your contacts"
    end
  end

  def destroy
    removed = current_user.remove_contact(@user) if @user

    redirect_back_or_to root_path, notice: "#{@user.username} has#{removed ? " " : " not "}been removed from your contacts"
  end

  private

  def contacts_params
    params.permit(:user_id)
  end

  def set_contact
    @user = User.find_by(pub_id: contacts_params[:user_id])
  end
end
