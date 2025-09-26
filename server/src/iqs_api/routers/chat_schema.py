from pydantic import BaseModel


class ParticipantResponseSchema(BaseModel):
    message: str
