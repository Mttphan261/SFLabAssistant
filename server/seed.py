from app import app
#import models when created
from models import db, Character, Move
import pickle
import os
import ipdb
import json

#write object creation for fighters, moves, etc

def load_characters():
    directory = 'JSON files'

    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            with open(os.path.join(directory, filename)) as file:
                data =  json.load(file)
                character_list = data['characters']
                for character_data in character_list:
                    character_name = character_data['name']
                    character_head_img = character_data['head_img']
                    character_main_img = character_data['main_img']

                    character = Character(
                        name = character_name,
                        head_img = character_head_img,
                        main_img = character_main_img
                    )

                    db.session.add(character)

    db.session.commit()

def load_moves():
    directory = 'JSON files'

    for filename in os.listdir(directory):
        if filename.endswith('json'):
            with open(os.path.join(directory, filename)) as file:
                data = json.load(file)
                move_list = data['moves']
                for move_data in move_list:
                    move_name = move_data['name']
                    move_command = move_data['command']
                    move_character = move_data.get('character_id', None)
                
                    move = Move(
                        name = move_name,
                        command = move_command,
                        character_id = move_character
                    )

                    db.session.add(move)

    db.session.commit()



def clear_tables():
    db.session.query(Character).delete()
    # db.session.query(Move).delete()
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        # ipdb.set_trace()
        clear_tables()
        load_characters()
        # load_moves()
        print('Seeding complete!')
        pass