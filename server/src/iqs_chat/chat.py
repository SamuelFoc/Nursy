from enum import Enum

from openai.types.chat import ChatCompletionAssistantMessageParam
from openai.types.chat import ChatCompletionMessageParam
from openai.types.chat import ChatCompletionSystemMessageParam
from openai.types.chat import ChatCompletionUserMessageParam
from pydantic import BaseModel


class Priority(Enum):
    NORMAL = 'normal'
    MEDIUM = 'medium'
    HIGH = 'high'
    INFECTION_HAZARD = 'infection_hazard'
    LIFE_THREATENING = 'life_threatening'


class Role(Enum):
    SYSTEM = 'system'
    USER = 'user'
    ASSISTANT = 'assistant'
    VERIFIER = 'verifier'


class RoleMapping:
    _map = {
        Role.SYSTEM: 'system',
        Role.USER: 'user',
        Role.ASSISTANT: 'assistant',
        Role.VERIFIER: 'system',
    }

    @staticmethod
    def map(role: Role) -> str:
        return RoleMapping._map[role]


class Message(BaseModel):
    role: Role
    content: str

    @classmethod
    def from_openai(cls, data: dict[str, str]) -> 'Message':
        return cls(role=Role(data['role']), content=data['content'])

    def to_openai(self) -> ChatCompletionMessageParam:
        if self.role == Role.SYSTEM or self.role == Role.VERIFIER:
            return ChatCompletionSystemMessageParam(
                content=self.content,
                role=Role.SYSTEM.value,
            )
        elif self.role == Role.USER:
            return ChatCompletionUserMessageParam(
                content=self.content,
                role=Role.USER.value,
            )
        elif self.role == Role.ASSISTANT:
            return ChatCompletionAssistantMessageParam(
                content=self.content,
                role=Role.ASSISTANT.value,
            )


class Chat(BaseModel):
    history: list[Message]
