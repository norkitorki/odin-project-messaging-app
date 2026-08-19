module UsersHelper
  def build_chats(user = current_user)
    chats = user.created_chats
    @public_chats = []
    @private_chats = []
    chats.each { |chat| chat.private ? @private_chats << chat : @public_chats << chat }
  end
end
