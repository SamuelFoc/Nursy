from collections import deque

from pydantic import BaseModel

from src.agents.chat_agent import ChatAgent
from src.iqs_ws.participant import Participant


class PublicQueue(BaseModel):
    queue: list[int]


class StateQueue:
    def __init__(self) -> None:
        self._idx: int = 0
        self._queue: deque[Participant] = deque()
        self._agents_queue_map: dict[str, ChatAgent] = {}

    def add_participant(self, participant: Participant) -> None:
        self._idx += 1
        participant.set_seq(self._idx)
        self._queue.append(participant)

    def assign_agent(self, participant: Participant, agent: ChatAgent) -> None:
        self._agents_queue_map[participant.session_id] = agent
        participant.set_agent_id(agent.id)

    def dequeue(self) -> Participant:
        participant = self._queue.popleft()
        if participant.session_id in self._agents_queue_map.keys():
            self._agents_queue_map.pop(participant.session_id)
        return participant

    def get_participant(self, session_id: str) -> Participant | None:
        for participant in self._queue:
            if participant.session_id == session_id:
                agent = self.get_agent(session_id)
                if agent:
                    participant.agent_flag = agent.flag
                    participant.agent_anamnesis = agent.anamnesis
                    participant.agent_diagnosis = agent.diagnosis
                    participant.agent_done = agent.end
                return participant
        return None

    def get_agent(self, session_id: str) -> ChatAgent | None:
        if session_id in self._agents_queue_map.keys():
            return self._agents_queue_map[session_id]
        return None

    def to_public_queue(self) -> PublicQueue:
        return PublicQueue(queue=[participant.seq for participant in self._queue if participant.seq is not None])

    def to_admin_queue(self) -> list[Participant]:
        return list(self._queue)

    def prioritize(self, id: str) -> None:
        for i, p in enumerate(self._queue):
            if p.session_id == id:
                self._queue.rotate(-i)
                break

    def __len__(self) -> int:
        return len(self._queue)
