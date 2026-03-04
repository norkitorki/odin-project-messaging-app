class ContactsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def create
    current_user.contacts << @user if @user
    redirect_to root_path, notice: "#{@user.username} added to your contacts"
  end

  def destroy
    current_user.remove_contact(@user) if @user
    redirect_to root_path, notice: "#{@user.username} removed from your contacts"
  end

  private

  def contacts_params
    params.permit(:pub_id)
  end

  def set_user
    @user = CoolId.locate(contacts_params[:pub_id])
  end
end
