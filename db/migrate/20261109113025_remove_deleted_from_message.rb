class RemoveDeletedFromMessage < ActiveRecord::Migration[8.1]
  def change
    remove_column :messages, :deleted
  end
end
