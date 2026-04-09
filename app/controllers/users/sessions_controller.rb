class Users::SessionsController < Devise::SessionsController
  def create
    warden.reset_session!
    self.resource = warden.authenticate(auth_options)

    if resource
      sign_in(resource_name, resource)
      redirect_to root_path, notice: "Signed in as #{resource.username}", status: :see_other
    else
      redirect_to root_path, alert: "Unable to find user"
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    redirect_to root_path, notice: signed_out ? "Signed out successfully" : "Already signed out"
  end
end
