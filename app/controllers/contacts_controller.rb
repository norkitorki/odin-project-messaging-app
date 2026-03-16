class ContactsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_contact

  def create
    contact = Contact.new(user: current_user, contact: @contact)

    if contact.save
      redirect_back_or_to root_path, notice: "#{@contact.username} was added to your contacts"
    else
      redirect_to root_path, notice: "#{@contact.username} was not added to your contacts"
    end
  end

  def destroy
    removed = current_user.remove_contact(@contact) if @contact

    redirect_back_or_to root_path, notice: "#{@contact.username} has #{removed ? "" : "not"} been removed from your contacts"
  end

  private

  def contacts_params
    params.permit(:pub_id)
  end

  def set_contact
    @contact = CoolId.locate(contacts_params[:pub_id])
  end
end
