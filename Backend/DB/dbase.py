from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

SQLALCHEMY_DATABASE_URL = os.environ["db"]

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255))
    session_ids = relationship('Session_Id', backref='Users', lazy=True)
    vids = relationship('History', backref='Users', lazy=True)

class Session_Id(Base):
    __tablename__ = "Session__Id"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(50))
    email_session = Column(String(120), ForeignKey('users.email'), nullable=False)

class History(Base):
    __tablename__ = "History"
    id = Column(Integer, primary_key=True)
    vid_name = Column(String(50))
    transcription_res = Column(Text())
    email_vid = Column(String(120), ForeignKey('users.email'), nullable=False)


class Otp(Base):
    __tablename__ = "Otp"
    id = Column(Integer, primary_key=True)
    email = Column(String(120), nullable =False)
    password = Column(String(255), nullable=False)
    otp = Column(String(6), nullable =False)
    name = Column(String(255))



# Create tables if they don't exist
Base.metadata.create_all(bind=engine)