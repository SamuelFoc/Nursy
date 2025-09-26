from pydantic import BaseModel

from src.iqs_ws.participant import Participant


class AdminQueueSchema(BaseModel):
    participants: list[Participant]
