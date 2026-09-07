module UsersHelper
  include PaginationHelper

  def build_user_content
    @chat_pages, @chats = initialize_pagination(@user.chats.includes(:admin, :users).where(private: false), user_path(pub_id: @user.pub_id, message_page: params[:message_page]), { per_page: 10, param: "chat_page", default_page: 1 })
    @message_pages, @messages = initialize_pagination(@user.messages.public_messages, user_path(pub_id: @user.pub_id, chat_page: params[:chat_page]), { per_page: 20, param: "message_page", default_page: 1 })
  end

  def build_chats
    public_parameters = pagination_parameters(:private_chat_page, :request_page)
    private_parameters = pagination_parameters(:public_chat_page, :request_page)
    @public_pages, @public_chats = initialize_pagination(collect_chats, edit_user_path(public_parameters), { per_page: 10, param: "public_chat_page", default_page: 1 })
    @private_pages, @private_chats = initialize_pagination(collect_chats(true), edit_user_path(private_parameters), { per_page: 10, param: "private_chat_page", default_page: 1 })
  end

  def build_requests
    parameters = pagination_parameters(:public_chat_page, :private_chat_page)
    @request_pages, @requests = initialize_pagination(current_user.requests.includes(:initiator, :receiver).order(created_at: :desc), edit_user_path(parameters), { per_page: 10, param: "request_page", default_page: 1 })
  end

  private

  def collect_chats(private = false)
    current_user.created_chats.includes(:admin, :users).where(private: private)
  end

  def pagination_parameters(*parameters)
    parameters.map { |para| [ para, params[para] ] }.to_h
  end
end
