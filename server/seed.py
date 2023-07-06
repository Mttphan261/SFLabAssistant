from app import app
#import models when created
from models import db, Character
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

def clear_tables():
    db.session.query(Character).delete()
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        # ipdb.set_trace()
        clear_tables()
        load_characters()
        print('Seeding complete!')
        pass