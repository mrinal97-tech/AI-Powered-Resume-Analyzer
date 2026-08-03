from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


class ExtractionResponse(BaseModel):
    filename: str
    text: str
    char_count: int


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        if len(password) < 8:
            raise ValueError(
                "Password must contain at least 8 characters"
            )

        if len(password.encode("utf-8")) > 72:
            raise ValueError(
                "Password must not exceed 72 bytes"
            )

        return password

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None
    filename: Optional[str] = None


class AnalysisResponse(BaseModel):
    ats_score: int
    skills_found: list[str]
    missing_skills: list[str]
    improvement_suggestions: list[str]
    experience_level: str
    summary: str


class AnalysisHistoryItem(BaseModel):
    id: int
    filename: Optional[str] = None
    ats_score: Optional[int] = None
    experience_level: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }