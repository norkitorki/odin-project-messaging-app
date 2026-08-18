module FormHelper
  private

  def build_errors(resource)
    @errors = { "#{params[:form_action]}": resource.errors.to_hash(true) }
  end
end
