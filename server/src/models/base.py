from enum import Enum

from pydantic import BaseModel


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

    @classmethod
    def map(cls, role: Role) -> str:
        return cls._map[role]


class Request(BaseModel):
    message: str


class Message(BaseModel):
    role: Role
    content: str

    @classmethod
    def from_openai_format(cls, data: dict[str, str]) -> 'Message':
        return cls(role=Role(data['role']), content=data['content'])

    def to_openai_format(self) -> dict[str, str]:
        return {
            'role': RoleMapping.map(self.role),
            'content': self.content,
        }


class Chat(BaseModel):
    chat_id: str
    history: list[Message]
