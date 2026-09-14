module UsersHelper
  include PaginationHelper

  PUBLIC_CHAT_PARAM = :public_chat_page
  PRIVATE_CHAT_PARAM = :private_chat_page
  REQUEST_PARAM = :request_page

  def public_user_content
    chats = @user.chats.includes(:admin, :users).where(private: false).page(params[:c_page]).per(20)
    @chats, @chat_pages = pagination_data(chats, user_path(pub_id: @user.pub_id, m_page: params[:m_page]), 20, :c_page)

    messages = @user.messages.public_messages.page(params[:m_page]).per(20)
    @messages, @message_pages = pagination_data(messages, user_path(pub_id: @user.pub_id, c_page: params[:c_page]), 20, :m_page)
  end

  def build_chats
    public_parameters = pagination_parameters(PRIVATE_CHAT_PARAM, REQUEST_PARAM)
    private_parameters = pagination_parameters(PUBLIC_CHAT_PARAM, REQUEST_PARAM)
    @public_chats, @public_pages = pagination_data(collect_chats, edit_user_path(public_parameters), 10, PUBLIC_CHAT_PARAM)
    @private_chats, @private_pages = pagination_data(collect_chats(true), edit_user_path(private_parameters), 10, PRIVATE_CHAT_PARAM)
  end

  def build_requests
    parameters = pagination_parameters(PUBLIC_CHAT_PARAM, PRIVATE_CHAT_PARAM)
    requests = current_user.requests.includes(:initiator, :receiver).order(created_at: :desc).page(params[:request_page]).per(10)
    @requests, @request_pages = pagination_data(requests, edit_user_path(parameters), 10, :request_page)
  end

  private

  def collect_chats(private = false)
    page = params[private ? PRIVATE_CHAT_PARAM : PUBLIC_CHAT_PARAM]
    current_user.created_chats.includes(:admin, :users).where(private: private).page(page).per(10)
  end

  def pagination_parameters(*parameters)
    parameters.map { |para| [ para, params[para] ] }.to_h
  end
end
