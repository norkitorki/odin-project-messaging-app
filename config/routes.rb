Rails.application.routes.draw do
  devise_for :users, skip: [ :sessions, :registrations ], controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  as :user do
    get "/signin", to: "users/sessions#new", as: :new_user_session
    get "/signup", to: "users#new", as: :user_registration
    post "/signin", to: "users/sessions#create", as: :user_session
    post "/signup", to: "users/registrations#create", as: :new_user_registration
    delete "/signout", to: "users/sessions#destroy", as: :destroy_user_session
    delete "/user", to: "users/registrations#destroy", as: :destroy_user
  end

  root "home#index"

  get "/chats", to: "chats#index", as: :chats
  get "/chats/new", to: "chats#new", as: :new_chat
  get "/chats/:pub_id", to: "chats#show", as: :chat
  get "/requests", to: "requests#index", as: :requests
  get "/requests/:pub_id", to: "requests#show", as: :request
  get "/users", to: "users#index", as: :users
  get "/users/:pub_id", to: "users#show", as: :user
  get "/sign_up", to: "users#new", as: :new_user

  post "/chat/join", to: "chat_members#create", as: :join_chat
  post "/chats/create", to: "chats#create", as: :create_chat
  post "/contacts/add", to: "contacts#create", as: :add_contact
  post "/messages/add", to: "messages#create", as: :add_message
  post "/requests/add", to: "requests#create", as: :add_request

  patch "/messages/update", to: "messages#update", as: :update_message
  patch "/requests/update", to: "requests#update", as: :update_request

  delete "/chat/leave", to: "chat_members#destroy", as: :leave_chat
  delete "/chats/delete", to: "chats#destroy", as: :delete_chat
  delete "/contacts/remove", to: "contacts#destroy", as: :remove_contact
end
