class UsersController < ApplicationController
  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!

  def index
  end
end
