class Users::AvatarsController < Devise::RegistrationsController
  before_action :authenticate_user!

  def destroy
    return redirect_back_or_to edit_user_path, alert: "No avatar to delete" unless current_user.avatar.attached?

    current_user.avatar.purge_later
    redirect_to edit_user_path, alert: "Avatar has been deleted"
  end
end
