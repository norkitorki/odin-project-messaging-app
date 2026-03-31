Rails.application.routes.draw do
  devise_for :users

  root "home#index"

  get "/chats", to: "chats#index", as: :chats
  get "/chats/new", to: "chats#new", as: :new_chat
  get "/requests", to: "requests#index", as: :requests
  get "/requests/:pub_id", to: "requests#show", as: :request
  get "/users", to: "users#index", as: :users

  post "/chats/create", to: "chats#create", as: :create_chat
  post "/contacts/add", to: "contacts#create", as: :add_contact
  post "/messages/add", to: "messages#create", as: :add_message
  post "/requests/add", to: "requests#create", as: :add_request

  patch "/messages/update", to: "messages#update", as: :update_message
  patch "/requests/update", to: "requests#update", as: :update_request

  delete "/chats/delete", to: "chats#destroy", as: :delete_chat
  delete "/contacts/remove", to: "contacts#destroy", as: :remove_contact
end
