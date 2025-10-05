from datetime import datetime
from datetime import timezone
from typing import Any

from pydantic import BaseModel

from src.iqs_chat.chat import Chat


class Participant(BaseModel):
    session_id: str
    seq: int | None = None
    called: bool | None = None
    num_calls: int = 0
    called_at: datetime | None = None
    resolved: bool = False
    resolved_at: datetime | None = None
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

    def call(self) -> None:
        self.called = True
        self.num_calls += 1
        self.called_at = datetime.now(timezone.utc)

    def resolve(self) -> None:
        self.resolved = True
        self.resolved_at = datetime.now(timezone.utc)
