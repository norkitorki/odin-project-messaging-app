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

  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)

    redirect_to root_path, notice: "User successfully deleted", status: :see_other
  end
end
