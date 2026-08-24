module UsersHelper
  include PaginationHelper

  def build_chats
    @public_pages, @public_chats = initialize_pagination(collect_chats, edit_user_path(private_chat_page: params[:private_chat_page]), { per_page: 10, param: "public_chat_page", default_page: 1 })
    @private_pages, @private_chats = initialize_pagination(collect_chats(true), edit_user_path(public_chat_page: params[:public_chat_page]), { per_page: 10, param: "private_chat_page", default_page: 1 })
  end

  private

  def collect_chats(private = false)
    current_user.created_chats.includes(:admin, :users).where(private: private)
  end
end
