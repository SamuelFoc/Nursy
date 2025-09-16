import os

import jwt
from dotenv import load_dotenv
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.iqs_api.db import user_crud
from src.iqs_api.hooks import on_db

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'secret-#0001-key')
ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def on_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(on_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get('sub')
        if email is None:
            raise HTTPException(status_code=401, detail='Invalid token')
    except Exception as e:
        raise HTTPException(status_code=401, detail='Invalid token') from e

    user = user_crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user
