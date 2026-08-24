module PaginationHelper
  def initialize_pagination(collection, url, opts = {})
    count = collection.count
    { per_page: opts[:per_page] || 30, param: opts[:param] || "page", default_page: opts[:default_page] } => { per_page:, param:, default_page: }
    page_count = count > 0 && count % per_page == 0 ? count / per_page : (count / per_page) + 1
    current_page = params[param]&.to_i || default_page || page_count
    pagination_items = collection.offset((current_page - 1) * per_page).limit(per_page)
    paths = collect_paths(url, page_count, param)

    return { count: page_count, current: current_page, paths: paths, total_count: count, per_page: per_page }, pagination_items
  end

  private

  def collect_paths(url, page_count, param)
    (1..page_count).map do |i|
      uri = URI.parse(url)
      query = Rack::Utils.parse_query(uri.query)
      query[param] = i
      uri.query = Rack::Utils.build_query(query)
      { page: i, url: uri.to_s }
    end
  end
end
