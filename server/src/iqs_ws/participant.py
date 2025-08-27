from openai import BaseModel

from src.iqs_chat.chat import Chat


class Participant(BaseModel):
    session_id: str
    seq: int | None = None
    chat: Chat | None = None
    agent_id: str | None = None

    def set_seq(self, seq: int) -> None:
        self.seq = seq

    def set_chat(self, chat: Chat) -> None:
        self.chat = chat

    def set_agent_id(self, id: str) -> None:
        self.agent_id = id
