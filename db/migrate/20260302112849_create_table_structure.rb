class CreateTableStructure < ActiveRecord::Migration[8.1]
  def change
    create_table :chat_rooms do |t|
      t.references :user, index: true
      t.references :chat, index: true
    end

    create_table :chats do |t|
      t.string :name
      t.string :pub_id
      t.index :pub_id, unique: true

      t.timestamps
    end

    create_table :contacts do |t|
      t.references :user, index: true
      t.references :contact, index: true
    end

    create_table :messages do |t|
      t.string :value
      t.boolean :deleted, default: false
      t.string :pub_id
      t.index :pub_id, unique: true
      t.references :chat, index: true
      t.references :user, index: true

      t.timestamps
    end

    create_table :users do |t|
      t.string :username
      t.string :pub_id
      t.index :username, unique: true
      t.index :pub_id, unique: true

      t.timestamps
    end
  end
end
