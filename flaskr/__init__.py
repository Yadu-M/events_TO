from flask import Flask, redirect
from flask_caching import Cache

import os
from dotenv import load_dotenv

from flaskr import api

DEV_CONFIG = 'dev.cfg'
load_dotenv()

def create_app(config_file=DEV_CONFIG):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_file)
    
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
    
    app.register_blueprint(api.blueprint)
    api.configure(app)
    
    # Configure Flask-Caching
    cache = Cache(app, config={
        'CACHE_TYPE': 'redis',
        'CACHE_REDIS_HOST': app.config['REDIS_HOST'],
        'CACHE_REDIS_PORT': app.config['REDIS_PORT'],
        'CACHE_REDIS_PASSWORD': REDIS_PASSWORD
    })


    @app.route('/')
    @cache.cached(timeout=60)  # Cache this route for 60 seconds
    def root():
        if app.config['ENV'] == 'development':
            return redirect(app.config['LOCAL_URL'])
        return app.send_static_file('index.html')

    return app
