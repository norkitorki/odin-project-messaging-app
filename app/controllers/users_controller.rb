class UsersController < ApplicationController
  include UsersHelper

  before_action :use_jsx_rendering_defaults
  before_action :authenticate_user!, except: :new

  def index
    chat = Chat.find_by(pub_id: params[:chat_id])
    @users = chat.users.includes(:avatar_blob).ordered_by_username
    @chat_data = { name: chat.name, path: chat_path(pub_id: chat.pub_id) }
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
