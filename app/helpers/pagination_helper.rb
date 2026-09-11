module PaginationHelper
  def pagination_data(collection, url, per_page, page_param, *opt_params)
    paths = pagination_paths(url, collection.total_pages, page_param, *opt_params)
    pages = pagination_pages(collection, per_page, paths)
    return collection, pages
  end

  private

  def pagination_paths(url, page_count, page_param, *params)
    (1..page_count).map do |i|
      uri = URI.parse(url)
      query = Rack::Utils.parse_query(uri.query)
      query[page_param] = i
      params.each { |key, val| query[key] = val }
      uri.query = Rack::Utils.build_query(query)
      { page: i, url: uri.to_s }
    end
  end

  def pagination_pages(collection, per_page, paths)
    {
      current: collection.current_page,
      previous: collection.prev_page,
      count: collection.total_pages,
      totalCount: collection.total_count,
      perPage: per_page,
      paths: paths
    }
  end
end
