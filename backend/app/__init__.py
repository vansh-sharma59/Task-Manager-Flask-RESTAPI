from flask import Flask
from .extensions import db, bcrypt, jwt, migrate, ma
from config import Config_dict
from .utils.error_handlers import register_error_handlers
import os


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(Config_dict[config_name])

    # ensures instance folder exists
    try:
        os.makedirs(app.instance_path)
        print(f'create instance folder at {app.instance_path}')
    except OSError:
        print('already created ')
        pass

    # Initialize extentions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # register error handlers
    register_error_handlers(app)

    # blueprint registration
    from .routes.v1.auth_route import auth_bp
    from .routes.v1.task_route import task_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)

    return app