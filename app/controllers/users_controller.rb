class UsersController < ApplicationController
  include UsersHelper

  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!, except: :new

  def index
  end

  def new
    @user = User.new
  end

  def show
    @user = User.find_by(pub_id: params[:pub_id])
  end

  def edit
    build_chats
  end
end
