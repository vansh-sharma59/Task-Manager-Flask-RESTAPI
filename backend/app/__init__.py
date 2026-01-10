from flask import Flask
from .extensions import db, bcrypt, jwt, migrate, ma
from backend.config import Config_dict
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

    return app