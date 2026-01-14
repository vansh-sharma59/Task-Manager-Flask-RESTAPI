from flask import Flask
from flask_cors import CORS
from .extensions import db, bcrypt, jwt, migrate, ma
from config import Config_dict
from .utils.error_handlers import register_error_handlers
import os


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(Config_dict[config_name])

    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
        expose_headers=["Content-Type", "Authorization"]
    )

    # ensures instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
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
    from .routes.v1.admin import user_admin_bp, task_admin_bp, monitor_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(user_admin_bp)
    app.register_blueprint(task_admin_bp)
    app.register_blueprint(monitor_bp)

    return app