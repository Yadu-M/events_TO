from flask import Flask, redirect

import os
from dotenv import load_dotenv


DEV_CONFIG = 'dev.cfg'
load_dotenv()

def create_app(config_file=DEV_CONFIG):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, 'backend.sqlite')
    )
    
    if config_file is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_pyfile(config_file)
        # app.config.from_mapping(config_file)
        
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    from . import db
    db.init_app(app)
    
    from .api import event, key, location, image
    app.register_blueprint(event.bp)
    app.register_blueprint(key.bp)
    app.register_blueprint(location.bp)
    app.register_blueprint(image.bp)

    @app.route('/')
    def root():
        if app.config['ENV'] == 'development':
            return redirect(app.config['LOCAL_URL'])
        return app.send_static_file('index.html')

    return app
