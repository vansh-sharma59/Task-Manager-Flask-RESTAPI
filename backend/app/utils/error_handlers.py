from flask import jsonify

# helper function for schema validation error
def validation_response(errors):
    return jsonify({
        'error': 'Validation failed',
        'fields': errors
    }), 400


def register_error_handlers(app):
    
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            'error':'Bad Request',
            'message': str(e.description) if hasattr(e, 'description') else "Invalid request data."
        }), 400
    
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found.'
        }), 404
    

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            'error': 'method not allowed.',
            'message': 'This HTTP method is not supported for this endpoint.'
        }), 405
    

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occured on our end.'
        }), 500
    

    @app.errorhandler(415)
    def unsupported_media_type(e):
        return jsonify({
            'error': 'Unsupported Media Type',
            'message': 'Did you attempt to load JSON data but forgot to set Content-Type: application/json?'
        }), 415

    # catch jwt related errors
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Missing or invalid authentication token'
        }), 401
