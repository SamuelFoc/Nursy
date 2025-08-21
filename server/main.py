import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.agents.chat_agent import ChatAgent
from src.agents.chat_agent import Message
from src.agents.chat_agent import Role
from src.agents.verification_agent import VerificationAgent
from src.communication.lib.prompts import DIAGNOSTIC_PROMPT
from src.communication.lib.prompts import REQUEST_VERIFICATION_PROMPT
from src.models.base import Chat
from src.models.base import Request

# ---- App setup ----


load_dotenv()
if not os.getenv('OPENAI_API_KEY'):
    raise RuntimeError('OPENAI_API_KEY not set')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # restrict in prod
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

verification_agent = VerificationAgent(REQUEST_VERIFICATION_PROMPT)
# TODO: Make it expiring dictionary
chat_agents: dict[str, ChatAgent] = {}


# ---- Routes ----


@app.post('/chat', response_model=Chat)
async def initiate_chat() -> Chat:
    chat_agent = ChatAgent(system_prompt=DIAGNOSTIC_PROMPT)
    chat_id = chat_agent.id
    chat_agent.init_conversation(
        Message(role=Role.ASSISTANT, content='To get started, can you tell me what symptoms or concerns brought you in today?'),
    )
    chat_agents[chat_id] = chat_agent
    return Chat(chat_id=chat_id, history=chat_agent.conversation_history)


@app.get('/chat/{chat_id}', response_model=Chat)
async def get_chat(chat_id: str) -> Chat:
    if chat_id not in chat_agents:
        raise HTTPException(status_code=404, detail='Conversation not found')

    chat_agent = chat_agents[chat_id]
    return Chat(chat_id=chat_id, history=chat_agent.conversation_history)


@app.post('/chat/{chat_id}', response_model=Chat)
async def chat(chat_id: str, request: Request) -> Chat:
    agent = chat_agents.get(chat_id)
    if not agent:
        raise HTTPException(status_code=404, detail='Conversation not found')

    if agent.is_generating:
        raise HTTPException(status_code=409, detail='Agent is currently generating a response.')

    last_question = [question for question in agent.conversation_history if question.role == Role.ASSISTANT][-1]
    last_response = Message(role=Role.USER, content=request.message)

    if not verification_agent.verify_input(last_question, last_response):
        agent.history.append(
            Message(role=Role.VERIFIER, content='Your response seems unrelated or inappropriate. Please rephrase.'),
        )
        return Chat(chat_id=chat_id, history=agent.conversation_history)

    follow_up_question = await agent.process_message(Message(role=Role.USER, content=request.message))
    agent.history.append(Message(role=Role.ASSISTANT, content=follow_up_question))

    return Chat(chat_id=chat_id, history=agent.conversation_history)
