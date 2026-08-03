from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto",)
SECRET_KEY = os.getenv("JWT_SECRET", "change-this-in-production")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    if len(password.encode("utf-8")) > 72:
        raise ValueError(
            "Password must not exceed 72 bytes"
        )

    return pwd_context.hash(password)

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    if len(plain_password.encode("utf-8")) > 72:
        return False

    return pwd_context.verify(
        plain_password,
        hashed_password,
    )
def create_token(user_id):
    payload = {
        "sub": str(user_id),   # ✅ convert to string
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
def decode_token(token: str) -> str:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload["sub"]