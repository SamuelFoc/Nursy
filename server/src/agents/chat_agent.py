import asyncio
from typing import Any
from uuid import uuid4

from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam

from src.communication.communication import CombinedPrompt
from src.communication.communication import Prompt
from src.iqs_chat.chat import Message
from src.iqs_chat.chat import Role
from src.lex.modules.response_parser import RegexParser


class ChatAgent:
    def __init__(self, system_prompt: Prompt | CombinedPrompt, model: str = 'gpt-5-nano', temperature: float = 0.3):
        self.id = str(uuid4())
        self.model = model
        self.temperature = temperature
        self.history: list[Message] = [Message(role=Role.SYSTEM, content=system_prompt.eval())]
        self._lock = asyncio.Lock()
        self._is_generating = False
        self._client = AsyncOpenAI()

        self._parser = RegexParser()
        self.flag: str | None = None
        self.anamnesis: dict[str, Any] | None = None
        self.diagnosis: str | None = None
        self.suggestion: str | None = None
        self.end: bool | None = None

    def _as_openai_messages(self) -> list[ChatCompletionMessageParam]:
        """Convert internal history to OpenAI chat message dicts."""
        return [m.to_openai() for m in self.history]

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

    @property
    def conversation_history(self) -> list[Message]:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')
        return [m for m in self.history if m.role != Role.SYSTEM]

    @property
    def is_generating(self) -> bool:
        return self._is_generating
