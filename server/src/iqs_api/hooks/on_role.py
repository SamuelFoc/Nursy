from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from src.iqs_api.hooks import on_current_user


def on_role(role: str, current_user=Depends(on_current_user)):
    if current_user.role != role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Admins only',
        )
    return current_user
