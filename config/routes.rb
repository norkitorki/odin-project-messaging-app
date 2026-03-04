Rails.application.routes.draw do
  devise_for :users

  root "home#index"

  post "/contacts", to: "contacts#create"
  delete "contacts", to: "contacts#destroy"
end
