class RequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :use_jsx_rendering_defaults, only: [ :index, :show ]
  before_action :set_request, only: [ :show, :update ]

  def index
  end

  def show
    redirect_to root_path if current_user != @request.receiver
  end

  def create
    @receiver = CoolId.locate(request_params[:receiver])

    if @receiver
      request_type = request_params[:requestType]
      create_friend_request if request_type == "friend"
    else
      redirect_back_or_to root_path, notice: "Receiver was not found"
    end
  end

  def update
    request_type = request_params[:requestType]
    accepted = params[:accept]
    update_friend_request if request_type == "friend" && accepted
    @request.destroy

    redirect_to requests_path, notice: "#{request_type.capitalize} request #{accepted ? "accepted" : "rejected"}"
  end

  private

  def set_request
    @request = CoolId.locate(params[:pub_id] || params[:request])
  end

  def request_params
    params.permit(:requestType, :receiver)
  end

  def create_friend_request
    return redirect_back_or_to root_path, notice: "#{@receiver.username} is already your friend" if current_user.contacts.include?(@receiver)

    request = current_user.initiated_requests.find_or_initialize_by(receiver: @receiver, request_type: request_params[:requestType])
    new_record = request.new_record?
    request.save if new_record

    redirect_back_or_to root_path, notice: "Friend request #{new_record ? "was sent" : "is still pending"}"
  end

  def update_friend_request
    initiator = @request.initiator
    current_user.contacts << initiator unless current_user.contacts.include?(initiator)
  end
end
