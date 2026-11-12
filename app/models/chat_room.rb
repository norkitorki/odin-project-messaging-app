class ChatRoom < ApplicationRecord
  belongs_to :chat, counter_cache: :users_count
  belongs_to :user
end
