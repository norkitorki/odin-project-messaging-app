require 'rails_helper'

RSpec.describe TimeHelper, type: :helper do
  before(:all) do
    class TestModel
      include TimeHelper

      def created_at
        Time.now - 1.hour
      end

      def updated_at
        Time.now - 30.minutes
      end
    end
  end

  describe "#created_at_time_in_words_to_now" do
    it "should return distance of time in words by creation" do
      instance = TestModel.new
      expect(instance.created_at_time_in_words_to_now).to eql("about 1 hour ago")
    end
  end

  describe "#updated_at_time_in_words_to_now" do
    it "should return distance of time in words by update" do
      instance = TestModel.new
      expect(instance.updated_at_time_in_words_to_now).to eql("30 minutes ago")
    end
  end
end
