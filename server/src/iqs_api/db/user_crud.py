import bcrypt
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.iqs_api.db.models import User


def create_user(db: Session, first_name: str, last_name: str, titul: str, role: str, email: str, password: str):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(
        first_name=first_name,
        last_name=last_name,
        titul=titul,
        role=role,
        email=email,
        password_hash=hashed,
    )
    db.add(user)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail='Email already registered') from e
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
