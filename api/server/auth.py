import os
from jose import jwt, JWTError
from dotenv import load_dotenv
from datetime import UTC, datetime, timedelta


load_dotenv()
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # e.g., {"sub": "patient_id"}
    except JWTError:
        return None
    
def generate_jwt():
    payload = {
        "sub": "test_user",
        "exp": datetime.now(UTC) + timedelta(hours=1)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)
    print("JWT:", token)