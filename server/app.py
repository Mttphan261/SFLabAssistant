from flask_migrate import Migrate
from models import Character, Move, User, UserCharacter, Video
from flask import Flask, request, session, make_response, jsonify, redirect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import app, db, api, Resource
import ipdb
import traceback
from YouTubeAPI import fetch_videos


migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()

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

class UserCharacters(Resource):
    @login_required
    def post(self):
        try:            
            data = request.get_json()
            name = data['name']
            user = current_user
            character = Character.query.filter_by(name=name).first()

            already_in_roster = UserCharacter.query.filter_by(
                user_id = user.id,
                character_id = character.id
            ).first()

            if already_in_roster:
                return {"message": "Character already exists in the user's roster"}, 400    

            new_user_character = UserCharacter(
                user_id = user.id,
                character_id = character.id,
                is_main = False,
                is_alt = False
            )
            db.session.add(new_user_character)
            db.session.commit()
            return new_user_character.to_dict(), 201
        
        except Exception as e:
            traceback.print_exc()
            return {"error": "UserCharacter failed.", "message": str(e)}, 500 
        
api.add_resource(UserCharacters, '/usercharacters')

#**********AUTHENTICATION ROUTES**********
class Users(Resource):
    @login_required
    def get(self):
        # try:
            user = current_user
            if user:
                # return {
                #     "id": user.id,
                #     "username": user.username,
                #     "email": user.email,
                #     # "videos": user.videos,'TypeError: Object of type Video is not JSON serializable'
                #     "user_characters": [uc.to_dict() for uc in user.user_characters]
                # }, 200
                return user.to_dict()
            else:
                return {"error": "User not found"}, 404
        # except:
        #     return {"error": "An error occurred while fetching the user"}, 500
    
    @login_required
    def delete(self):
        try:
            user = current_user
            if user:
                db.session.delete(user)
                db.session.commit()
                return {}, 204
            else:
                return {"error": "User not found"}, 404
        except:
            return {"error":"An error occurred while deleting the user"}, 500


api.add_resource(Users, '/users')

class Signup(Resource):
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                username=data['username'],
                email=data['email'],
            )
            new_user.password_hash = data['password']
            db.session.add(new_user)
            db.session.commit()

            # session['user_id'] = new_user.id
            login_user(new_user, remember=True)

            return new_user.to_dict(), 201
        
        except Exception as e:
            traceback.print_exc()
            return {"error": "Signup failed.", "message": str(e)}, 500

api.add_resource(Signup, '/signup')


class Login(Resource):

    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            user = User.query.filter(User.username == username).first()

            if user:
                if user.authenticate(password):
                    login_user(user, remember=True)
                    return {'message': 'Login successful'}, 200
            return {'error': '401 Unauthorized'}, 401
        
        except Exception as e:
            traceback.print_exc()
            return {"error": "Signup failed.", "message": str(e)}, 500        


api.add_resource(Login, '/login')

class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            user = current_user.to_dict()
            return user, 200
        return {"error": "unauthorized"}, 401

api.add_resource(CheckSession, '/check_session')

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return f'You have logged out. Goodbye'

class Videos(Resource):
    @login_required
    def post(self):
        try:
            data = request.get_json()
            character_id = data['character_id']
            video_id = data['video_id']

            video_data = fetch_videos([video_id])
            if video_data:
                video_info = video_data[0]
                title = video_info['title']
                description = video_info['description']
                embed_html = video_info['embed_html']

                video = Video(
                    title = title,
                    description = description,
                    video_id = video_id,
                    embed_html = embed_html,
                    character_id = character_id,
                    user_id = current_user.id
                )
                db.session.add(video)
                db.session.commit()
                return video.to_dict(), 201
            
        except Exception as e:
            traceback.print_exc()
            return {"error": "Video Submission failed", "message": str(e)}, 500

api.add_resource(Videos, '/videos')


class UserCharacterVideos(Resource):
    @login_required
    def post(self, user_character_id):
        try:
            user_character = UserCharacter.query.get(user_character_id)

            if not user_character or user_character.user_id != current_user.id:
                return {'error': 'User character not found'}, 404
            data = request.get_json()
            title = data.get('title')
            description = data.get('description')
            video_id = data.get('video_id')
            embed_html = data.get('embed_html')

            video = Video(
                title=title,
                description=description,
                video_id=video_id,
                embed_html=embed_html,
                user_character_id=user_character_id
            )

            db.session.add(video)
            db.session.commit()

            return video.to_dict(), 201
        except Exception as e:
            traceback.print.exc()
            return {'error': 'Failed to add video to user character', 'message': str(e)}, 500
        
api.add_resource(UserCharacterVideos, '/usercharacters/<int:user_character_id>/videos')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
