import os
from datetime import UTC
from datetime import datetime
from datetime import timedelta

import jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'secret-#0001-key')
ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv('JWT_EXPIRES_IN_MINUTES', 10)


def create_access_token(data: dict[str, str]) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)))
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
