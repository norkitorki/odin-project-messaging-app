class PrivateMessagesController < ApplicationController
  include PaginationHelper

  before_action :authenticate_user!
  before_action :set_receiver
  before_action :receiver_is_contact, only: :create

  def create
    @message = @receiver.private_messages.new(message_params.merge({ initiator_id: current_user.id }))

    if @message.save
      redirect_to user_path(pub_id: @receiver.pub_id), notice: "Message to #{@receiver.username} successfully delivered"
    else
      redirect_to user_path(pub_id: @receiver.pub_id), alert: "Message could not be delivered"
    end
  end

  def destroy
    message = current_user.private_messages.find_by(pub_id: params[:message_id])
    alert = message&.destroy ? "Message successfully deleted" : "Message could not be found"

    redirect_to edit_user_path, alert: alert
  end

  private

  def set_receiver
    @receiver = User.find_by(pub_id: params[:receiver_id])
  end

  def receiver_is_contact
    redirect_back_or_to root_path, alert: "You are unauthorized to send a message to this user" unless current_user.contacts.include?(@receiver)
  end

  def message_params
    params.permit(:value)
  end
end
