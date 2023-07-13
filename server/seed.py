from app import app
#import models when created
from models import db, Character, Move, Video, UserCharacter, TrainingNote
import pickle
import os
import ipdb
import json
from YouTubeAPI import fetch_videos

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

def load_videos():

    default_videos = {
        'Marisa': ['E9u9TyC5TU4', 'BZoam-rO1A0'],
        'Manon': ['QNaLU5Ir-eQ', 'pSuXvrr2KqI'],
        'Jamie': ['B_JELPmJD6w', 'KEUj5BANBrs'],
        'Guile': ['3_3RnvP25fA', 'iGZFz6ZbJRc'],
        'JP': ['UGFPppRCjGc', 'RDXD2s1xryY'],
        'Luke': ['8QtRDbIE8aM', 'aucwezgb97I'],
        'Juri': ['peQvaStC7kM', 'NqPBY-dcj0o'],
        'Lily': ['x2qP1sbcYe8', 'e4_Ye9OXF_k'],
        'Ken Masters': ['vmqsVjH4DrI', 'CQvJ2yuu-dU'],
        'E. Honda': ['bxHQ_wKhrH0', 'FDtSER6giRY'],
        'Dhalsim': ['K1Y9kKpQax0', 'VjppLRwuNVw'],
        'Kimberly': ['cGHHeQRhcSg', 'raIV4VAHm1Y'],
        'Dee Jay': ['kV76g9r2jD4', 'qlznrgyQlqM'],
        'Ryu': ['VRBV__y-h0A', '5YorOxTBOT8'],
        'Chun-Li': ['Av7TBL1x6nA', 'mlgcxuG-190'],
        'Blanka': ['rq3w9dTUF3A', 'rvbtEi1glMU'],
        'Zangief': ['NicxJ0n7kiI', 'oGyLbt5M4_I'],
        'Cammy': ['zN7UaBCaT_w', 'Miag9zpaW_Q']
    }

    for character_name, video_ids in default_videos.items():
        
        character = Character.query.filter_by(name=character_name).first()
        videos = fetch_videos(video_ids)

        for video_info in videos:
            video = Video(
                video_id = video_info['video_id'],
                embed_html = video_info['embed_html'],
                title = video_info['title'],
                description = video_info['description'],
                character_id = character.id
            )

            db.session.add(video)

    db.session.commit()


def clear_tables():
    # db.session.query(Character).delete()
    # db.session.query(Move).delete()
    db.session.query(Video).delete()
    db.session.query(UserCharacter).delete()
    db.session.query(TrainingNote).delete()

if __name__ == "__main__":
    with app.app_context():
        # ipdb.set_trace()
        clear_tables()
        print('Clearing tables...')
        # # load_characters()
        # print('Loading characters...')
        # # load_moves()
        # print('Loading moves...')
        load_videos()
        print('loading videos...')
        print('Seeding complete!')
        pass