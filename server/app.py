from flask_migrate import Migrate
from models import Character
from flask import Flask, request, session, make_response, jsonify, redirect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import app, db, api, Resource
import ipdb


migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

class Characters(Resource):
    def get(self):
        try:
            characters = [c.to_dict() for c in Character.query.all()]
            return characters, 200
        except:
            return {'error' : 'characters not found'}, 404

api.add_resource(Characters, '/characters')

class CharacterByName(Resource):
    def get(self, name):
        try:
            character = Character.query.filter_by(name=name).first().to_dict()
            return character, 200
        except:
            return {'error': 'fighter not found'}, 404

api.add_resource(CharacterByName, '/characters/<string:name>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)