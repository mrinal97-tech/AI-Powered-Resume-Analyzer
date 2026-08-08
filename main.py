from fastapi import FastAPI, UploadFile, File, HTTPException,Depends,Header,status
import io
from sqlalchemy.orm import Session
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer

from database import get_db,engine,Base
from models_db import Analysis,User
from schemas import UserCreate, UserLogin, TokenResponse
from services.auth import hash_password, verify_password, create_token, decode_token
from fastapi.middleware.cors import CORSMiddleware
from services.extractor import extract_resume_text
from services.auth import decode_token
from services.llm import analyze_resume_with_retry

from models import ExtractionResponse,AnalysisHistoryItem
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


import json
from fastapi.responses import StreamingResponse

from services.llm import (
    analyze_resume,
    stream_analysis
)
from models import AnalysisRequest, AnalysisResponse

Base.metadata.create_all(bind=engine)

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
@app.post("/extract", response_model=ExtractionResponse)
async def extract(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        text = extract_resume_text(contents, file.content_type)

        return {
            "filename": file.filename,
            "text": text,
            "char_count": len(text)
        }

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        user_id = decode_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user



@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        raw_json = analyze_resume_with_retry(
            request.resume_text,
            request.job_description
)
        data = json.loads(raw_json)

        validated_result = AnalysisResponse(**data)

        new_analysis = Analysis(
    user_id=current_user.id,

    filename=request.filename,

    resume_text=request.resume_text,

    job_description=request.job_description,

    ats_score=validated_result.ats_score,

    skills_found=json.dumps(
        validated_result.skills_found
    ),

    missing_skills=json.dumps(
        validated_result.missing_skills
    ),

    improvement_suggestions=json.dumps(
        validated_result.improvement_suggestions
    ),

    experience_level=validated_result.experience_level,

    summary=validated_result.summary,
)

        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)

        return validated_result

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="LLM returned invalid JSON"
        )

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(error)
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
@app.get(
    "/history",
    response_model=list[AnalysisHistoryItem]
)
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    history = []

    for analysis in analyses:
        history.append(
            AnalysisHistoryItem(
                id=analysis.id,
                filename=analysis.filename,
                ats_score=analysis.ats_score,
                experience_level=analysis.experience_level,
                summary=analysis.summary,
                created_at=analysis.created_at,
            )
        )

    return history
    
