from fastapi import WebSocket
from app.agents.chat_agent import ChatAgent
from app.agents.verification_agent import VerificationAgent
from app.communication.lib.prompts import DIAGNOSTIC_PROMPT, ANSWER_VERIFICATION_PROMPT
from app.lex.extractor import Extractor

class ConnectionManager:
    def __init__(self):
        self.active_sessions = {}  # token -> session context

    async def connect(self, websocket: WebSocket, token: str):
        await websocket.accept()
        self.active_sessions[token] = {
            "socket": websocket,
            "chat_agent": ChatAgent(DIAGNOSTIC_PROMPT),
            "verification_agent": VerificationAgent(ANSWER_VERIFICATION_PROMPT),
            "extractor": Extractor()
        }

    def disconnect(self, token: str):
        self.active_sessions.pop(token, None)

    def get_session(self, token: str):
        return self.active_sessions.get(token)