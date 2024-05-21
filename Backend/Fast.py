#import dotenv
#dotenv.load_dotenv()

import io
from typing import Annotated
from fastapi import FastAPI, Depends, Form, Request, BackgroundTasks, File, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
import os
import openai
import random
from DB import dbase
from DB.dbase import Users, Session_Id, Otp, History
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import time
from uuid import uuid4




# Dependency to get a SQLAlchemy session
def get_db():
    db = dbase.SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()



### Adding Middlewares
origins = [
    "http://localhost:5173",
    "https://el-transcriber.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.environ["secretkey"],  # Change to a secure random secret key
    session_cookie="session",  # Name for your session cookie
    same_site="None",  # SameSite cookie policy
    https_only=True,  # Set to True for HTTPS-only environments
    max_age=86400
)







api_key = os.environ["APIKEY"]

client = openai.OpenAI(api_key=api_key)









def Transcribe(file2):
    print("transcribing")
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=("your-audio.mp3", file2, "audio/mp3"),
        response_format="text"
    )
    print("Transcription", transcript)
    return transcript


def OTP():
    res = ""
    for i in range(6):
        res += str(random.randrange(0,10))
    return res

conf = ConnectionConfig(
    MAIL_USERNAME=os.environ["MAIL_USERNAME"],
    MAIL_PASSWORD=os.environ["MAIL_PASSWORD"],
    MAIL_FROM="eltranscriber.email@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="in-v3.mailjet.com",
    MAIL_FROM_NAME="El-Transcriber",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER='./'
)
fm = FastMail(conf)

def send_email_background(background_tasks: BackgroundTasks, subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype="plain",
    )
    
    background_tasks.add_task(
       fm.send_message, message)





@app.get("/")
def read_root(request: Request,background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    #send_email_background(background_tasks, "Welcome", "alaaorabi952@gmail.com", "Hi")
    #session = request.session
    return {"Hello": "World"}

@app.get("/ping")
def dummy():
    return "pong"

@app.get("/dummy")
def dum(request:Request, response:Response):
    print(request.session)
    request.session["A"] = "A"
    return "pong"

@app.post("/transcribe")
async def transcribe(request: Request,db: Session = Depends(get_db),file: UploadFile = File(...)):
    session = request.session

    form_data = await request.form()
    #file = form_data["file"]
    name = file.filename
    filecont = await file.read()
    await file.close()
    
    file = filecont
    file = io.BytesIO(file)
    file =  io.BufferedReader(file)
    start= time.time()
    transcription = Transcribe(file)
    print(time.time()-start)
    print(session)
    session_id1 = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    user = db.query(Users).filter_by(email=email).first()
    user.vids.append(History(vid_name=name,email_vid= user, transcription_res=transcription))
    db.commit()
    
    return {"transcription":transcription}


@app.get("/getuser")
def getuser(request: Request, db: Session = Depends(get_db)):
    session = request.session
    if "uid" in session:
        session_id1 = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
    else:
        session_id1 = None
    if session_id1:
        user = db.query(Users).filter_by(email=session_id1.email_session).first()
        if user:
            return {"status": 200,"name":user.name, "id":user.id, "email":user.email}
        else:
            return {"result":"error"}
    else:
        return {"result":"Not found"}

@app.get("/gethistory")
def history(request: Request, db: Session = Depends(get_db)):
    session = request.session
    session_id1 = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    history_list = db.query(History).filter_by(email_vid=email)
    history_sent = []
    for his in history_list:
        history_sent.append((his.vid_name, his.transcription_res, his.id))
    return {"result":history_sent}


@app.post("/clearhistory")
def clear(request:Request, db: Session = Depends(get_db)):
    session = request.session
    session_id1 = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    history_list = db.query(History).filter_by(email_vid=email)
    for his in history_list:
        db.delete(his)
    db.commit()
    return {"result":200}

class Item(BaseModel):
    id: str

@app.post("/deleteitem")
def deletingitem(request:Request, item:Item, db: Session = Depends(get_db)):
    session = request.session
    session_id1 = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    item = db.query(History).filter_by(email_vid=email, id=int(item.id)).first()
    if item:
        db.delete(item)
        db.commit()
    return {"result":200}



class MUser(BaseModel):
    email: str = ""
    password: str = ""
    name: str = ""
    otp: str = ""


@app.post('/register')
def register(request:Request, muser:MUser, background_tasks:BackgroundTasks, db:Session = Depends(get_db)):
    user = db.query(Users).filter_by(email=muser.email).first()
    if user:
        
        return {"result":"User exists"}
    else:
        otp = OTP()
        db.add(Otp(email= muser.email, password = muser.password, otp=otp, name=muser.name))
        db.commit()
        send_email_background(background_tasks,"Your OTP for El-Transcriber!", muser.email,f"Hey {muser.name}, \n Here is your OTP, {otp}")

        return {"status":200, "otp":otp}
    
@app.post('/emailauth')
def mailauth(request:Request, muser:MUser, db:Session = Depends(get_db)):
    session = request.session
    temp_user = db.query(Otp).filter_by(email=muser.email, otp=muser.otp).first()
    if temp_user:
        uid = uuid4()
        db.add(Users(name=temp_user.name,email= muser.email, password =temp_user.password))
        db.commit()
        user = db.query(Users).filter_by(email=muser.email, password= temp_user.password).first()
        user.session_ids.append(Session_Id(session_id = uid, email_session= user))
        session["uid"] = str(uid)


        db.delete(temp_user)
        db.commit()
        return {"status": 200,"name":user.name, "id":user.id, "email":user.email}
    else:
        return {"status": "Incorrect"}





    


@app.post('/login')
def login(request:Request, muser:MUser, db: Session = Depends(get_db)):
    session = request.session
    user = db.query(Users).filter_by(email=muser.email, password= muser.password).first()
    if user:
        uid = uuid4()
        user.session_ids.append(Session_Id(session_id = uid, email_session= user))
        db.commit()
        session["uid"] = str(uid)
        print(session)
        return {"status": 200,"name":user.name, "id":user.id, "email":user.email}
    else:
        return {"result": "Not found"}

@app.post('/logout')
def logout(request: Request, db: Session = Depends(get_db)):
    session = request.session
    try:  
        current_id = db.query(Session_Id).filter_by(session_id=str(session["uid"])).first()
        db.delete(current_id)
        db.commit()
        del session["uid"]
    except:
        ...
    return {"res":200}





