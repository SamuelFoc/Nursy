import os

from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from openai import BaseModel

from src.agents.chat_agent import ChatAgent
from src.agents.verification_agent import VerificationAgent
from src.communication.lib.prompts import DIAGNOSTIC_PROMPT
from src.communication.lib.prompts import REQUEST_VERIFICATION_PROMPT
from src.iqs_api.hooks.use_queue import use_queue
from src.iqs_chat.chat import Chat
from src.iqs_chat.chat import Message
from src.iqs_chat.chat import Role
from src.iqs_ws.queue import StateQueue


class ParticipantResponse(BaseModel):
    message: str


load_dotenv()
if not os.getenv('OPENAI_API_KEY'):
    raise RuntimeError('OPENAI_API_KEY not set')

router = APIRouter()
verification_agent = VerificationAgent(REQUEST_VERIFICATION_PROMPT)


@router.post('/init/{session_id}', response_model=Chat)
async def init_chat(session_id: str, queue: StateQueue = Depends(use_queue)) -> Chat:
    participant = queue.get_participant(session_id)
    if not participant:
        raise HTTPException(status_code=404, detail=f'Participant with session_id: {session_id} not found')

    if not participant.agent_id:
        agent = ChatAgent(system_prompt=DIAGNOSTIC_PROMPT)
        queue.assign_agent(participant, agent)
        agent.init_conversation(
            Message(role=Role.ASSISTANT, content='To get started, can you tell me what symptoms or concerns brought you in today?'),
        )
        chat = Chat(history=agent.conversation_history)
        participant.set_chat(chat)
        return chat

    return participant.chat


@router.get('/{session_id}', response_model=Chat)
async def get_chat(session_id: str, queue: StateQueue = Depends(use_queue)) -> Chat:
    participant = queue.get_participant(session_id)

    if not participant:
        raise HTTPException(status_code=404, detail=f'Participant with session_id: {session_id} not found')

    if participant.chat is None:
        raise HTTPException(status_code=404, detail=f'No chat found for session_id: {session_id}, first call /api/chat/init/{session_id}')

    return participant.chat


@router.post('/{session_id}', response_model=Chat)
async def chat(session_id: str, request: ParticipantResponse, queue: StateQueue = Depends(use_queue)) -> Chat:
    participant = queue.get_participant(session_id)

    if participant.agent_id is None:
        raise HTTPException(status_code=404, detail=f'No agent found for session_id: {session_id}, first call /api/chat/init/{session_id}')

    agent = queue.get_agent(session_id)

    if agent.is_generating:
        raise HTTPException(status_code=409, detail='Agent is currently generating a response.')

    last_question = [question for question in agent.conversation_history if question.role == Role.ASSISTANT][-1]
    last_response = Message(role=Role.USER, content=request.message)

    if not verification_agent.verify_input(last_question, last_response):
        agent.history.append(
            Message(role=Role.VERIFIER, content='Your response seems unrelated or inappropriate. Please rephrase.'),
        )
        chat = Chat(history=agent.conversation_history)
        participant.set_chat(chat)
        return participant.chat

    follow_up_question = await agent.process_message(Message(role=Role.USER, content=request.message))
    agent.history.append(Message(role=Role.ASSISTANT, content=follow_up_question))
    chat = Chat(history=agent.conversation_history)
    participant.set_chat(chat)
    return participant.chat
