class CreatePrivateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :private_messages do |t|
      t.string :value
      t.string :pub_id
      t.index :pub_id, unique: true
      t.references :initiator, index: true
      t.references :receiver, index: true

      t.timestamps
    end
  end
end
