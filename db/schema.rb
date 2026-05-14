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

ActiveRecord::Schema[8.1].define(version: 2026_05_07_090229) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "chat_rooms", force: :cascade do |t|
    t.bigint "chat_id"
    t.bigint "user_id"
    t.index ["chat_id"], name: "index_chat_rooms_on_chat_id"
    t.index ["user_id"], name: "index_chat_rooms_on_user_id"
  end

  create_table "chats", force: :cascade do |t|
    t.bigint "admin_id"
    t.datetime "created_at", null: false
    t.string "name"
    t.boolean "private", default: false
    t.string "pub_id"
    t.datetime "updated_at", null: false
    t.index ["admin_id"], name: "index_chats_on_admin_id"
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
    t.string "parent_id"
    t.string "pub_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "value"
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["parent_id"], name: "index_messages_on_parent_id"
    t.index ["pub_id"], name: "index_messages_on_pub_id", unique: true
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "requests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "initiator_id"
    t.string "pub_id"
    t.bigint "receiver_id"
    t.string "reference_pub_id"
    t.string "request_type"
    t.datetime "updated_at", null: false
    t.index ["initiator_id"], name: "index_requests_on_initiator_id"
    t.index ["pub_id"], name: "index_requests_on_pub_id", unique: true
    t.index ["receiver_id"], name: "index_requests_on_receiver_id"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
