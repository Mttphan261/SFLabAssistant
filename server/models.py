from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from collections import OrderedDict
from flask_login import UserMixin, LoginManager

from config import db, bcrypt

################## Models Below####################

class Character(db.Model, SerializerMixin):
    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    head_img = db.Column(db.String)
    main_img = db.Column(db.String)

    moves = db.relationship('Move', back_populates='character')

    # def __repr__(self):
    #     return f'ID: {self.id}, Name: {self.name}'
    
class Move(db.Model, SerializerMixin):
    __tablename__ = 'moves'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    command = db.Column(db.String)

    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))
    #relationships
    character = db.relationship('Character', back_populates='moves')

    def __repr__(self):
        return f'Move: {self.id}, Character: {self.character_id}'

