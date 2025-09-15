from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.iqs_api.db import user_crud
from src.iqs_api.db.database import Base
from src.iqs_api.db.database import engine
from src.iqs_api.hooks.use_db import use_db
from src.iqs_api.jwt.utils import create_access_token
from src.iqs_api.routers.auth_schema import LoginSchema
from src.iqs_api.routers.auth_schema import TokenSchema
from src.iqs_api.routers.auth_schema import UserSchema

Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post('/register', status_code=201)
async def register(user: UserSchema, db: Session = Depends(use_db)):
    user_crud.create_user(db, user.first_name, user.last_name, user.titul, user.role, user.email, user.password)
    return {'msg': 'User registered'}


@router.post('/login', response_model=TokenSchema)
async def login(user: LoginSchema, db: Session = Depends(use_db)):
    db_user = user_crud.get_user_by_email(db, user.email)
    if not db_user or not user_crud.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    access_token = create_access_token(data={'sub': db_user.email})
    return {'access_token': access_token, 'token_type': 'bearer'}
