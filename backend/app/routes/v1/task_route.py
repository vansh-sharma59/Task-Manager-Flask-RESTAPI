from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ...models.task import Task
from ...extensions import db
from ...schemas import task_schema, tasks_schema
from ...utils.jwt_utils import get_current_user_id
from ...utils.error_handlers import validation_response


task_bp = Blueprint('task_bp', __name__, url_prefix='/api/v1/tasks')

# get all tasks(for logged-in user)
@task_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_current_user_id()

    # only filter tasks belonging to user_id
    user_tasks = Task.query.filter_by(user_id=user_id).all()
    return tasks_schema.jsonify(user_tasks), 200


# create new task
@task_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_current_user_id()
    data = request.get_json()

    errors = task_schema.validate(data)
    if errors:
        return validation_response(errors)
    
    new_task = Task(
        title= data.get('title'),
        description= data.get('description'),
        status= data.get('status', 'pending'),
        user_id= user_id
    )

    try:
        db.session.add(new_task)
        db.session.commit()
        return task_schema.jsonify(new_task), 201
    except Exception as e:
        db.session.rollback()
        return {'error': 'Internal Server Error'}, 500
    

# get a specific task by task id
@task_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_current_user_id()
    
    # filter by task_id and user_id both for security
    task = Task.query.filter_by(task_id=task_id, user_id=user_id).first_or_404()
    return task_schema.jsonify(task), 200


# update an existing task (partial or full)
@task_bp.route('/<int:task_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_task(task_id):
    user_id = get_current_user_id()
    task = Task.query.filter_by(task_id=task_id, user_id=user_id).first_or_404()

    data = request.get_json()

    # update field if they exists in the requests
    if 'title' in data:
        task.title = data.get('title')
    if 'description' in data:
        task.description = data.get('description')
    if 'status' in data:
        task.status = data.get('status')

    try:
        db.session.commit()
        return task_schema.jsonify(task), 200
    except Exception as e:
        db.session.rollback()
        return {'error': 'could not update task', 'details': str(e)}, 500
    


# delete an existing task
@task_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_current_user_id()
    task = Task.query.filter_by(task_id=task_id, user_id=user_id).first_or_404()

    try:
        db.session.delete(task)
        db.session.commit()
        return {'msg': 'task deleted successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': 'could not delete task', 'details': str(e)}, 500