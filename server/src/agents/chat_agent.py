import asyncio
from typing import Any
from uuid import uuid4

from openai import AsyncOpenAI

from src.communication.communication import Prompt
from src.lex.modules.anamnesis_parser import RegexParser
from src.models.base import Message
from src.models.base import Role


class ChatAgent:
    def __init__(self, system_prompt: Prompt, model: str = 'gpt-5-nano', temperature: float = 0.3):
        self.id = str(uuid4())
        self.model = model
        self.temperature = temperature
        self.history: list[Message] = [Message(role=Role.SYSTEM, content=system_prompt.eval())]
        self._lock = asyncio.Lock()
        self._is_generating = False
        self._client = AsyncOpenAI()

        self._parser = RegexParser()
        self.flag: str | None = None
        self.anamnesis: str | None = None
        self.diagnosis: str | None = None
        self.suggestion: str | None = None
        self.end: str | None = None

    def _as_openai_messages(self) -> list[dict[str, Any]]:
        """Convert internal history to OpenAI chat message dicts."""
        return [m.to_openai_format() for m in self.history]

    def init_conversation(self, first_message: Message) -> None:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')
        if first_message.role not in (Role.USER, Role.ASSISTANT):
            raise ValueError('first_message.role must be USER or ASSISTANT.')
        self.history.append(first_message)

    async def process_message(self, message: Message) -> str:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')

        async with self._lock:
            self._is_generating = True
            try:
                self.history.append(message)

                resp = await self._client.chat.completions.create(
                    model=self.model,
                    messages=self._as_openai_messages(),
                    # temperature=self.temperature,
                    stream=False,
                )
                full = (resp.choices[0].message.content or '').strip()
                parsed = self._parser.parse(full)

                self.flag = parsed.flag
                self.anamnesis = parsed.anamnesis
                self.diagnosis = parsed.diagnosis
                self.suggestion = parsed.suggestion
                self.end = parsed.end

                return parsed.question or ''
            finally:
                self._is_generating = False

    def clear_history(self, keep_system_prompt: bool = True) -> None:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response. Please wait.')
        if keep_system_prompt and self.history:
            self.history = [self.history[0]]
        else:
            self.history = []
        self.flag = None
        self.anamnesis = None
        self.diagnosis = None
        self.suggestion = None
        self.end = None

    @property
    def conversation_history(self) -> list[Message]:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')
        return [m for m in self.history if m.role != Role.SYSTEM]

    @property
    def is_generating(self) -> bool:
        return self._is_generating
