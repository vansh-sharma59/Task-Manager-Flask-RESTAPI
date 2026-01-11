from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ....models import Task
from ....extensions import db
from ....utils.decorators import admin_required
from ....utils.jwt_utils import get_current_user_id
from ....schemas import  tasks_schema

task_admin_bp = Blueprint('task_admin_bp', __name__, url_prefix='/api/v1/admin/tasks')


# view all tasks
@task_admin_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
def view_all_tasks():
    tasks = Task.query.all()
    return tasks_schema.jsonify(tasks), 200


# view tasks of a specific user
@task_admin_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def view_user_tasks(user_id):
    tasks = Task.query.filter_by(user_id=user_id).all()
    return tasks_schema.jsonify(tasks), 200


# delete any task
@task_admin_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    try:
        db.session.delete(task)
        db.session.commit()
        return {'msg': 'Task deleted by admin'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    