require 'rails_helper'

RSpec.describe "PaginationHelper", type: :request do
  include PaginationHelper

  fixtures :users

  describe "#pagination_data" do
    it "should return collection" do
      users = User.page(1).per(10)
      collection, _ = pagination_data(users, "/", 10, "page")

      expect(collection).to match_array(users)
    end

    it "should return pages hash" do
      20.times { |i| User.create!(username: "user_#{i}", password: "***", password_confirmation: "***") }
      users = User.page(2).per(10)
      _, pages = pagination_data(users, "/my_users", 10, "page")

      expect(pages).to eql({ current: 2, previous: 1, count: 3, totalCount: 23, perPage: 10, paths: [
        { page: 1, url: "/my_users?page=1" },
        { page: 2, url: "/my_users?page=2" },
        { page: 3, url: "/my_users?page=3" }
      ] })
    end
  end
end
