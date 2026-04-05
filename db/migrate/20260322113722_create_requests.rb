class CreateRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :requests do |t|
      t.string :request_type
      t.string :pub_id
      t.string :reference_pub_id
      t.index :pub_id, unique: true
      t.references :initiator, index: true
      t.references :receiver, index: true

      t.timestamps
    end
  end
end
