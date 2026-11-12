class AddCounterCacheColumnsToChats < ActiveRecord::Migration[8.1]
  def change
    add_column :chats, :users_count, :integer, default: 0, null: false
    add_column :chats, :messages_count, :integer, default: 0, null: false
  end
end
