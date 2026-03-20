# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_02_114215) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "chat_rooms", force: :cascade do |t|
    t.bigint "chat_id"
    t.bigint "user_id"
    t.index ["chat_id"], name: "index_chat_rooms_on_chat_id"
    t.index ["user_id"], name: "index_chat_rooms_on_user_id"
  end

  create_table "chats", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.string "pub_id"
    t.datetime "updated_at", null: false
    t.index ["pub_id"], name: "index_chats_on_pub_id", unique: true
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "contact_id"
    t.bigint "user_id"
    t.index ["contact_id"], name: "index_contacts_on_contact_id"
    t.index ["user_id"], name: "index_contacts_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "chat_id"
    t.datetime "created_at", null: false
    t.boolean "deleted", default: false
    t.string "pub_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "value"
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["pub_id"], name: "index_messages_on_pub_id", unique: true
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "pub_id"
    t.datetime "remember_created_at"
    t.datetime "updated_at", null: false
    t.string "username"
    t.index ["pub_id"], name: "index_users_on_pub_id", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end
end
