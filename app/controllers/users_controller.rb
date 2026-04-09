class UsersController < ApplicationController
  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!, only: :index

  def index
  end

  def new
    @user = User.new
  end
end
