from flask import jsonify

# helper function for schema validation error
def validation_response(errors):
    return jsonify({
        'error': 'Validation failed',
        'fields': errors
    }), 400


def register_error_handlers(app):
    
    @app.errorhandler(Exception)
    def bad_request(e):
        return jsonify({
            'error':'Bad Request',
            'message': str(e.description) if hasattr(e, 'description') else "Invalid request data."
        }), 400
    
    
    @app.errorhandler(Exception)
    def not_found(e):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found.'
        }), 404
    

    @app.errorhandler(Exception)
    def method_not_allowed(e):
        return jsonify({
            'error': 'method not allowed.',
            'message': 'This HTTP method is not supported for this endpoint.'
        }), 405
    

    @app.errorhandler(Exception)
    def internal_server_error(e):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occured on our end.'
        }), 500
    

    # catch jwt related errors
    @app.errorhandler(Exception)
    def unauthorized(e):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Missing or invalid authentication token'
        }), 401

    
    @app.errorhandler(Exception)
    def unhandled_exception(e):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'unexpected error occured'
        }), 500