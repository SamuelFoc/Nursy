import asyncio
from collections.abc import AsyncGenerator
from enum import Enum
from typing import Any

from openai import AsyncOpenAI
from pydantic import BaseModel

from src.communication.communication import Prompt


class Role(Enum):
    SYSTEM = 'system'
    USER = 'user'
    ASSISTANT = 'assistant'


class Message(BaseModel):
    role: Role
    content: str

    @classmethod
    def from_openai_format(cls, data: dict[str, str]) -> 'Message':
        return cls(role=Role(data['role']), content=data['content'])

    def to_openai_format(self) -> dict[str, str]:
        return {
            'role': self.role.value,
            'content': self.content,
        }


class ChatAgent:
    def __init__(self, system_prompt: Prompt, model: str = 'gpt-4o-mini', temperature: float = 0.3):
        self.model = model
        self.temperature = temperature
        self.history: list[Message] = [Message(role=Role.SYSTEM, content=system_prompt.eval())]
        self._lock = asyncio.Lock()
        self._is_generating = False
        self._client = AsyncOpenAI()

    def _as_openai_messages(self) -> list[dict[str, Any]]:
        """Convert internal history to OpenAI chat message dicts."""
        return [m.to_openai_format() for m in self.history]

    def init_conversation(self, first_message: Message) -> None:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')
        if first_message.role not in (Role.USER, Role.ASSISTANT):
            raise ValueError('first_message.role must be USER or ASSISTANT.')
        self.history.append(first_message)

    def get_conversation_history(self) -> list[Message]:
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')
        return [m for m in self.history if m.role != Role.SYSTEM]

    async def process_message(self, message: Message) -> AsyncGenerator[str, None]:
        """Send user input and return an async generator for streaming response."""
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response.')

        async with self._lock:
            self._is_generating = True
            try:
                self.history.append(message)
                async for chunk in self._call_openai_stream():
                    yield chunk
            finally:
                self._is_generating = False

    async def _call_openai_stream(self) -> AsyncGenerator[str, None]:
        """Streaming OpenAI call that yields chunks and updates history."""
        response_content = ''

        stream = await self._client.chat.completions.create(
            model=self.model,
            messages=self._as_openai_messages(),
            temperature=self.temperature,
            stream=True,
        )

        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                response_content += delta
                yield delta

        if response_content:
            self.history.append(Message(role=Role.ASSISTANT, content=response_content))

    def clear_history(self, keep_system_prompt: bool = True) -> None:
        """Clear conversation history, optionally keeping the system prompt."""
        if self._is_generating:
            raise RuntimeError('Agent is currently generating a response. Please wait.')

        if keep_system_prompt and self.history:
            self.history = [self.history[0]]  # Keep only system prompt
        else:
            self.history = []

    @property
    def is_generating(self) -> bool:
        return self._is_generating
