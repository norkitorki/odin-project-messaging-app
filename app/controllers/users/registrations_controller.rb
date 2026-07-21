class Users::RegistrationsController < Devise::RegistrationsController
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

    resource_updated = update_resource(resource, account_update_params)
    if resource_updated
      bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?
      redirect_to edit_user_path, notice: "User has been successfully updated"
    else
      clean_up_passwords resource
      set_minimum_password_length
      @errors = resource.errors.to_hash(true)
      @chats = resource.chats.includes(:admin, :users).where(admin: current_user)
      flash.now[:alert] = "User has not been updated"
      render "users/edit"
    end
  end

  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

    redirect_to root_path, notice: "User successfully deleted", status: :see_other
  end
end
