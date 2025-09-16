from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from src.iqs_api.db.models import User
from src.iqs_api.hooks.on_current_user import on_current_user


def on_role(*roles: str):
    def role_checker(current_user: User = Depends(on_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f'Requires role in {roles} got {current_user.role}',
            )
        return current_user

    return role_checker
