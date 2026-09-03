class Users::RegistrationsController < Devise::RegistrationsController
  include FormHelper
  include UsersHelper

  def create
    warden.reset_session!
    build_resource(sign_up_params)

    if resource.save
      sign_in(:user, resource)
      redirect_to root_path, notice: "Signed up successfully.", status: :see_other
    else
      @user = resource
      render "users/new"
    end
  end

  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)

    resource_updated = send("update_#{params[:user][:avatar] ? 'avatar' : 'resource'}", resource, account_update_params)
    if resource_updated
      bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?
      redirect_to edit_user_path(u: true), notice: "User has been successfully updated"
    else
      clean_up_passwords resource
      set_minimum_password_length
      build_chats
      build_requests
      build_errors(resource)
      flash.now[:alert] = "User could not be updated"
      render "users/edit"
    end
  end

  def destroy
    resource.avatar.purge_later
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

    redirect_to root_path, notice: "User successfully deleted", status: :see_other
  end

  private

  def update_avatar(resource, params)
    resource.update(params)
  end
end
