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

    def __repr__(self):
        return f'ID: {self.id}, Name: {self.name}'
