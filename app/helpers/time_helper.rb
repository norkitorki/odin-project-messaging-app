module TimeHelper
  include ActionView::Helpers::DateHelper

  def created_at_time_in_words_to_now
    "#{distance_of_time_in_words_to_now(created_at)} ago"
  end

  def updated_at_time_in_words_to_now
    "#{distance_of_time_in_words_to_now(updated_at)} ago"
  end
end
