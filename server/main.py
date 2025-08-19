import os
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.agents.chat_agent import ChatAgent
from src.agents.chat_agent import Message
from src.agents.chat_agent import Role
from src.communication.lib.prompts import DIAGNOSTIC_PROMPT


class Request(BaseModel):
    message: str


class Chat(BaseModel):
    chat_id: str
    history: list[Message]


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

# TODO: Make it expiring dictionary
chat_agents: dict[str, ChatAgent] = {}


# ---- Routes ----


@app.post('/chat', response_model=Chat)
async def initiate_chat() -> Chat:
    chat_id = str(uuid4())
    chat_agent = ChatAgent(system_prompt=DIAGNOSTIC_PROMPT)
    chat_agent.init_conversation(
        Message(role=Role.ASSISTANT, content='To get started, can you tell me what symptoms or concerns brought you in today?'),
    )
    chat_agents[str(chat_id)] = chat_agent
    return Chat(chat_id=chat_id, history=chat_agent.get_conversation_history())


@app.get('/chat/{chat_id}', response_model=Chat)
async def get_chat(chat_id: str) -> Chat:
    if chat_id not in chat_agents:
        raise HTTPException(status_code=404, detail='Conversation not found')

    chat_agent = chat_agents[chat_id]
    return Chat(chat_id=chat_id, history=chat_agent.get_conversation_history())


@app.post('/chat/{chat_id}')
async def chat(chat_id: str, request: Request) -> StreamingResponse:
    agent = chat_agents.get(chat_id)
    print(agent)
    if not agent:
        raise HTTPException(status_code=404, detail='Conversation not found')

    if agent.is_generating:
        raise HTTPException(status_code=409, detail='Agent is currently generating a response.')

    async def generate_response():
        message = Message(role=Role.USER, content=request.message)
        try:
            async for chunk in agent.process_message(message):
                yield f'data: {chunk}\n\n'
        except Exception as e:
            yield f'data: Error: {str(e)}\n\n'
        finally:
            yield 'data: [DONE]\n\n'

    return StreamingResponse(
        generate_response(),
        media_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    )
