from fastapi import FastAPI, UploadFile, File, HTTPException
import io
from sqlalchemy.orm import Session
from jose import JWTError

from database import get_db
from models_db import User
from schemas import UserCreate, UserLogin, TokenResponse
from services.auth import hash_password, verify_password, create_token, decode_token
from fastapi.middleware.cors import CORSMiddleware
from services.extractor import extract_resume_text
from models import ExtractionResponse

import json
from fastapi.responses import StreamingResponse
from services.llm import (
    analyze_resume,
    stream_analysis
)
from models import AnalysisRequest, AnalysisResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return{"status":"ok"}

@app.post("/upload")
async def Upload_resume(file:UploadFile = File(...)):
    #validate file types
    allowed_types = ["application/pdf",
                     "application/vnd.openxmlformats-officedocument"
                     ".wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400,
                            detail = "Only PDF and DOCX Files are allowed")

    #validate the file size(max=5MB)
    contents = await file.read()
    if len(contents)>5*1024*1024:
        raise HTTPException(status_code=400,
                            detail="File size is too large.Max 5MB")
    
    return{
        "filename":file.filename,
        "content_type":file.content_type,
        "size_bytes":len(contents)
    }
@app.post("/extract",response_model=ExtractionResponse)
async def extract(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        text = extract_resume_text(contents, file.content_type)
        return {"text": text, "char_count": len(text)}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
@app.post("/analyze")
async def analyze(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        raw_json = analyze_resume(
            request.resume_text,
            request.job_description
        )

        print("JSON TO PARSE:")
        print(raw_json)

        data = json.loads(raw_json)

        return AnalysisResponse(**data)

    except json.JSONDecodeError as e:
        print("JSON ERROR:", e)
        print("RAW RESPONSE:", raw_json)

        raise HTTPException(
            status_code=500,
            detail="LLM returned invalid JSON"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.post("/analyze/stream")
async def analyze_stream(
    request: AnalysisRequest
):

    return StreamingResponse(
        stream_analysis(
            request.resume_text,
            request.job_description
        ),
        media_type="text/plain"
    )
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "email": new_user.email
    }
    
@app.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_token(db_user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    try:
        scheme, token = authorization.split()

        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme"
            )

        user_id = decode_token(token)

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )