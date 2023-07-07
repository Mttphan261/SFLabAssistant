from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from collections import OrderedDict
from flask_login import UserMixin, LoginManager
import re
from datetime import datetime

from config import db, bcrypt

################## Models Below####################

class Character(db.Model, SerializerMixin):
    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    head_img = db.Column(db.String)
    main_img = db.Column(db.String)

    #relationships
    moves = db.relationship('Move', back_populates='character')    #relationships
    user_characters = db.relationship('UserCharacter', back_populates='character')

    #serialization
    serialize_rules = ('-moves.character',)

    def __repr__(self):
        return f'ID: {self.id}, Name: {self.name}'
    
class Move(db.Model, SerializerMixin):
    __tablename__ = 'moves'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    command = db.Column(db.String)

    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))

    #relationships
    character = db.relationship('Character', back_populates='moves')

    #serialization
    serialize_rules = ('-character.moves',)

    def __repr__(self):
        return f'Move: {self.id}, Character: {self.character_id}'

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #VALIDATIONS
    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError('Invalid email format')
        return email

    @validates('username')
    def validate_username(self, key, username):
        if not username and len(username) < 1:
            raise ValueError('Invalid username')
        return username

    #PASSWORD HASHING
    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    #relationships
    user_characters = db.relationship('UserCharacter', back_populates='user')

    #serialization
    serialize_rules = ('-user.user_characters',)

    def __repr__(self):
        return f'''
        ID: {self.id},
        Username: {self.username},
        Email: {self.email}
        UserCharacters: {self.user_character}
        '''
    
class UserCharacter(db.Model, SerializerMixin):
    __tablename__ = 'user_characters'

    id = db.Column(db.Integer, primary_key=True)
    is_main = db.Column(db.Boolean)
    is_alt = db.Column(db.Boolean)
    #SAVED VIDEOS WILL GO HERE

    #FKs
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))
    
    #relationships
    user = db.relationship('User', back_populates='user_characters')
    character = db.relationship('Character', back_populates='user_characters')

    #serialization
    serialize_rules = ('-user.user_characters',)

    def __repr__(self):
        return f'''
        ID: {self.id}
        Character: {self.character.name}
        User: {self.user.username},
        '''


    