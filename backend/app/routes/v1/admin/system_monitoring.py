from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ....models import User, Task
from ....utils.decorators import admin_required

monitor_bp = Blueprint('monitor_bp', __name__, url_prefix='/api/v1/admin/monitor')


# to see how many users and tasks exists
@monitor_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    return jsonify({
        'total_users': str(User.query.count()),
        'total_tasks': str(Task.query.count())
    }), 200