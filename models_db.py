from sqlalchemy import Column, String, Integer, Text, DateTime,ForeignKey
from sqlalchemy.sql import func
import uuid
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    # One user has many analyses
    analyses = relationship(
        "Analysis",
        back_populates="user"
    )

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String,ForeignKey("user.id"), nullable=False)
    filename = Column(String)
    ats_score = Column(Integer)
    result_json = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    user = relationship(
        "User",
        back_populates="analyses"
    )