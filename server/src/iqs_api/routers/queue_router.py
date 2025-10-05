from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from src.iqs_api.hooks.on_queue import on_queue
from src.iqs_ws.participant import Participant
from src.iqs_ws.queue import PublicQueue
from src.iqs_ws.queue import StateQueue

router = APIRouter()


@router.get('/', response_model=PublicQueue)
async def get_public_queue(queue: StateQueue = Depends(on_queue)) -> PublicQueue:
    return queue.to_public_queue()


@router.post('/register/{session_id}', response_model=Participant)
async def register_participant(session_id: str, queue: StateQueue = Depends(on_queue)) -> Participant:
    participant = queue.get_participant(session_id)
    if participant is not None:
        return participant
    participant = Participant(session_id=session_id)
    queue.add_participant(participant)
    return participant


@router.get('/participant/{session_id}', response_model=Participant)
async def get_participant(session_id: str, queue: StateQueue = Depends(on_queue)) -> Participant:
    participant = queue.get_participant(session_id)

    if not participant:
        raise HTTPException(status_code=404, detail=f'Participant with session_id: {session_id} not found')
    return participant


@router.post('/call/{session_id}', response_model=Participant)
async def call_participant(session_id: str, queue: StateQueue = Depends(on_queue)) -> Participant:
    participant = queue.get_participant(session_id)
    if participant is None:
        raise HTTPException(status_code=404, detail=f'Participant with session_id: {session_id} not found')
    participant.call()
    return participant


@router.post('/resolve/{session_id}', response_model=Participant)
async def resolve_participant(session_id: str, queue: StateQueue = Depends(on_queue)) -> Participant:
    participant = queue.get_participant(session_id)
    if participant is None:
        raise HTTPException(status_code=404, detail=f'Participant with session_id: {session_id} not found')
    participant.resolve()
    return participant
