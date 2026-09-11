class UsersController < ApplicationController
  include UsersHelper

  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!, only: :edit

  def new
    @user = User.new
  end

  def show
    @user = User.find_by(pub_id: params[:pub_id])
    @userIsContact = current_user.contacts.include?(@user) if user_signed_in?
    public_user_content
  end

  def edit
    build_chats
    build_requests
  end
end
