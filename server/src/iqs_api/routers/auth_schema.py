from pydantic import BaseModel


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    titul: str
    role: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = 'bearer'
