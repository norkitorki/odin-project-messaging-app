module RequestsHelper
  private

  def create_chat_request
    chat = CoolId.locate(params[:chat_id])
    return redirect_back_or_to chats_path, alert: "You are not authorized to invite users to this chat" if chat.admin != current_user

    receiver = User.find_by(username: params[:receiver])
    if chat && receiver
      return redirect_back_or_to chats_path, notice: "User is already a chat member" if chat.users.include?(receiver)

      request = current_user.initiated_requests.find_or_initialize_by(receiver: receiver, request_type: "chat", reference_pub_id: chat.pub_id)
      new_record = request.new_record?
      request.save if new_record

      redirect_to chat_path(chat.pub_id), notice: "Chat invite #{new_record ? "was sent" : "is still pending"}"
    else
      redirect_back_or_to chats_path, alert: "Unable to find chat or receiver"
    end
  end

  def create_friend_request
    receiver = CoolId.locate(params[:receiver])

    return redirect_back_or_to root_path, notice: "#{receiver.username} is already your friend" if current_user.contacts.include?(receiver)

    request = current_user.initiated_requests.find_or_initialize_by(receiver: receiver, request_type: "friend")
    new_record = request.new_record?
    request.save if new_record

    redirect_back_or_to root_path, notice: "Friend request #{new_record ? "was sent" : "is still pending"}"
  end

  def accept_chat_request
    chat = CoolId.locate(@request.reference_pub_id)
    if chat
      chat.users << current_user
      @request.destroy

      redirect_to chat_path(pub_id: chat.pub_id), notice: "Chat request accepted"
    end
  end

  def accept_friend_request
    initiator = @request.initiator
    current_user.contacts << initiator
    @request.destroy

    redirect_to requests_path, notice: "Friend request accepted"
  end
end
