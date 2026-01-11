from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ....extensions import db
from ....models import User
from ....utils.decorators import admin_required
from ....schemas import user_schema, users_schema
from ....utils.jwt_utils import get_current_user_id

user_admin_bp = Blueprint('user_admin_bp', __name__, url_prefix='/api/v1/admin/users')

# get all users info
@user_admin_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
def view_all_users():
    users = User.query.all()
    return users_schema.jsonify(users), 200


# view a specific user
@user_admin_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def view_user(user_id):
    user = User.query.get_or_404(user_id)
    return user_schema.jsonify(user), 200


# delete user
@user_admin_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        return {'msg': f'User {user_id} and their tasks deleted'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    

# change user role
@user_admin_bp.route('/<int:user_id>/role', methods=['PATCH'])
@jwt_required()
@admin_required
def change_role(user_id):
    user = User.query.get_or_404(user_id)
    current_admin_id = get_current_user_id()
    data = request.get_json()
    
    # set role
    new_role = data.get('role')
    if str(user.id) == str(current_admin_id) and new_role != 'admin':
        return {'error': 'You cannot demote yourself from admin status'}, 403

    if new_role not in ['user', 'admin']:
        return {'error': f'Invalid role {new_role}, Allowed roles are: user, admin'}, 400
    
    if user.role == new_role:
        return {'msg': f'User is already a {new_role}'}, 200
    
    try:
        user.role = new_role
        db.session.commit()
        return {
            'msg': 'Role updated successfully',
            'user_id' : user.id,
            'new_role' : user.role
            }, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500
    