class RequestsController < ApplicationController
  include RequestsHelper

  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, only: [ :index, :show ]
  before_action :set_request, only: [ :show, :update ]
  before_action :authorize_receiver, only: [ :show, :update ]

  def index
  end

  def show
  end

  def create
    case params[:request_type]
    when "chat" then create_chat_request
    when "friend" then create_friend_request
    else redirect_back_or_to root_path, notice: "Invalid request type"
    end
  end

  def update
    @request_type = params[:request_type]
    accepted = !params[:accept].nil?

    if accepted
      return case @request_type
             when "chat" then accept_chat_request
             when "friend" then accept_friend_request
             else redirect_back_or_to requests_path, notice: "Invalid request type"
             end
    end

    @request.destroy

    redirect_to requests_path, notice: "#{@request_type.capitalize} request has been rejected"
  end

  private

  def authorize_receiver
    redirect_back_or_to requests_path, notice: "You are not authorized to see this request" unless current_user == @request&.receiver
  end

  def set_request
    @request = CoolId.locate(params[:pub_id] || params[:request])
  end

  def request_params
    params.permit(:requestType, :receiver)
  end
end
