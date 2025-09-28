from typing import Any

from openai import BaseModel

from src.iqs_chat.chat import Chat


class Participant(BaseModel):
    session_id: str
    seq: int | None = None
    chat: Chat | None = None
    agent_id: str | None = None
    agent_flag: str | None = None
    agent_anamnesis: dict[str, Any] | None = None
    agent_diagnosis: str | None = None
    agent_suggestion: str | None = None
    agent_done: bool | None = None

    def set_seq(self, seq: int) -> None:
        self.seq = seq

    def set_chat(self, chat: Chat) -> None:
        self.chat = chat

    def set_agent_id(self, id: str) -> None:
        self.agent_id = id
