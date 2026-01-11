from flask import Blueprint, request
from ...models.user import User
from ...schemas import user_schema, register_schema, login_schema
from ...extensions import db
from ...utils.jwt_utils import generate_tokens, get_current_user_id, refresh_access_token, logout_user
from ...utils.error_handlers import validation_response
from flask_jwt_extended import jwt_required

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data.get('email')).first():
        return {'msg':'email already exists'}, 400
    
    errors = register_schema.validate(data)
    if errors:
        return validation_response(errors)
    
    new_user = User(
        username = data.get('username'),
        email = data.get('email')
        )

    new_user.set_password(data.get('password'))

    try:
        db.session.add(new_user)
        db.session.commit()
        return {
            'msg':'user created successfully',
            'user': user_schema.dump(new_user)
            }, 201
    except Exception as e:
        db.session.rollback()
        return {'msg': 'Internal Server Error'}, 500
    


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    errors = login_schema.validate(data)
    if errors:
        return validation_response(errors)
    
    # check if user exists and password matches
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return {'error': 'invalid credentials'}, 401
    
    # generate token using utils functions
    tokens = generate_tokens(user.id)

    user_data = user_schema.dump(user)

    return {
        'access_token': tokens['access_token'],
        'refresh_token': tokens['refresh_token'],
        'user': user_data
    }, 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    # get details ofthe logged-in user
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    if not user:
        return {'error': 'user not found'}, 404
    return user_schema.dump(user), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    return refresh_access_token()


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # logout and clear jwt token
    return logout_user(), 200