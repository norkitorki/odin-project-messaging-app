class AddParentIdToMessages < ActiveRecord::Migration[8.1]
  def change
    add_column :messages, :parent_id, :bigint
    add_index :messages, :parent_id
  end
end
