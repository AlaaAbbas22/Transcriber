import os
from flask import Flask, request, session
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy
import openai
from sqlalchemy.orm import relationship
import io
import random
from flask_mail import Mail, Message
#import dotenv

#dotenv.load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ["secretkey"]
app.config["SESSION_TYPE"] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
)

# Email
app.config["MAIL_SERVER"] = "in-v3.mailjet.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USERNAME"] = os.environ["MAIL_USERNAME"]
app.config["MAIL_PASSWORD"] = os.environ["MAIL_PASSWORD"]
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

app.permanent_session_lifetime = timedelta(days=1000)
CORS(app, supports_credentials=True)
Session(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["db"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)





class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255))
    session_ids = relationship('Session_Id', backref='Users', lazy=True)
    vids = relationship('History', backref='Users', lazy=True)

class Session_Id(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(50))
    email_session = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vid_name = db.Column(db.String(50))
    transcription_res = db.Column(db.Text())
    email_vid = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)


class Otp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable =False)
    password = db.Column(db.String(255), nullable=False)
    otp = db.Column(db.String(6), nullable =False)
    name = db.Column(db.String(255))



api_key = os.environ["APIKEY"]

client = openai.OpenAI(api_key=api_key)

def Transcribe(file2):
    
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=file2,
        response_format="text"
    )
    print("Transcription", transcript)
    return transcript


def OTP():
    res = ""
    for i in range(6):
        res += str(random.randrange(0,10))
    return res

@app.route("/transcribe", methods=["POST"])
def transcribe():
    print(request.files.values)   
    file =  io.BufferedReader(request.files["file.mp3"])
    print(type(file), file)
    transcription = Transcribe(file)
    print(Transcribe(file))
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    user = Users.query.filter_by(email=email).first()
    
    user.vids.append(History(vid_name=request.files["file.mp3"].filename,email_vid= user, transcription_res=transcription))
    db.session.commit()
    return {"transcription":transcription}


@app.route("/dummy", methods=["GET"])
def dummy():
    return {"result":1}


@app.route('/')
def home():
    return 'Hello, World!'

@app.route("/gethistory", methods=["GET"])
def history():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    history_list = History.query.filter_by(email_vid=email)
    history_sent = []
    for his in history_list:
        history_sent.append((his.vid_name, his.transcription_res, his.id))
    return {"result":history_sent}

@app.route("/clearhistory", methods=["POST"])
def clear():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    history_list = History.query.filter_by(email_vid=email)
    for his in history_list:
        db.session.delete(his)
    db.session.commit()
    return {"result":200}

@app.route("/deleteitem", methods=["POST"])
def deletingitem():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    item = History.query.filter_by(email_vid=email, id=int(request.json["id"])).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return {"result":200}



@app.route('/register', methods = ["POST"])
def register():
    
    user = Users.query.filter_by(email=request.json["email"]).first()
    if user:
        
        return {"result":"User exists"}
    else:
        otp = OTP()
        db.session.add(Otp(email= request.json["email"], password =request.json["password"], otp=otp, name=request.json["name"]))
        db.session.commit()
        msg = Message('Your OTP for El-Transcriber!', sender =   'eltranscriber.email@gmail.com', recipients = [request.json["email"]])
        msg.body = f"Hey {request.json['name']}, \n Here is your OTP, {otp}"
        mail.send(msg)
        
        return {"status":200, "otp":otp}
    
@app.route('/emailauth', methods = ["POST"])
def mailauth():
    temp_user = Otp.query.filter_by(email=request.json["email"], otp=request.json["otp"]).first()
    if temp_user:
        uid = uuid4()
        db.session.add(Users(name=temp_user.name,email= request.json["email"], password =temp_user.password))
        user = Users.query.filter_by(email=request.json["email"], password= temp_user.password).first()
        user.session_ids.append(Session_Id(session_id = uid, email_session= user))
        session["uid"] = str(uid)


        db.session.delete(temp_user)
        db.session.commit()
        return {"status": 200,"name":user.name, "id":user.id, "email":user.email}
    else:
        return {"status": "Incorrect"}

@app.route('/login', methods = ["POST"])
def login():
    user = Users.query.filter_by(email=request.json["email"], password= request.json["password"]).first()
    if user:
        uid = uuid4()
        user.session_ids.append(Session_Id(session_id = uid, email_session= user))
        db.session.commit()
        session["uid"] = str(uid)
        return {"status": 200,"name":user.name, "id":user.id, "email":user.email}
    else:
        return {"result": "Not found"}

@app.route('/logout', methods = ["POST"])
def logout():
    try:  
        current_id = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
        db.session.delete(current_id)
        db.session.commit()
        del session["uid"]
    except:
        ...
    return {"res":200}





if __name__ == '__main__': 
    with app.app_context():
        db.create_all()
    app.run(debug = True, port= 8000)

