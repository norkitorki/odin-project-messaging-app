Rails.application.routes.draw do
  devise_for :users

  root "home#index"

  get "/chats", to: "chats#index", as: :chats
  get "/users", to: "users#index", as: :users

  post "/chats/open", to: "chats#create", as: :open_chat
  post "/contacts/add", to: "contacts#create", as: :add_contact
  post "/messages/add", to: "messages#create", as: :add_message

  delete "/chats/close", to: "chats#destroy", as: :close_chat
  delete "contacts/remove", to: "contacts#destroy", as: :remove_contact
  delete "/messages/remove", to: "messages#destroy", as: :remove_message
end
