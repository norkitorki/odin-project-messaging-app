class UsersController < ApplicationController
  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!, except: :new

  def index
  end

  def new
    @user = User.new
  end

  def show
  end
end
