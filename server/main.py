import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import openai
from communication.communication import Prompt
from uuid import UUID, uuid4
from agents.chat_agent import ChatAgent
from communication.lib.prompts import DIAGNOSTIC_PROMPT
from dotenv import load_dotenv


load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')  
app = FastAPI()

# TODO: Make it expiring dictionary
chat_agents: dict[str, ChatAgent] = {}


class MessageRequest(BaseModel):
    message: str



@app.post("/conversation")
async def initiate_conversation() -> dict:
    conversation_id = uuid4()
    chat_agent = ChatAgent(system_prompt=DIAGNOSTIC_PROMPT)
    first_question = chat_agent.start_conversation('To get started, can you tell me what symptoms or concerns brought you in today?')
    # TODO: Make it expiring dictionary and set expiration date so it doesn't linger FOREVER
    chat_agents[str(conversation_id)] = chat_agent
    return {"conversation_id": str(conversation_id), "init_message": first_question}


@app.get("/conversation/{conversation_id}")
async def conversation(conversation_id: str):
    if conversation_id not in chat_agents:
        raise HTTPException(status_code=204, detail="Conversation not found")
    
    chat_agent = chat_agents[conversation_id]
    history = chat_agent.get_conversation_history()

    return {"conversation_id": conversation_id, "history": history}


@app.post("/conversation/{conversation_id}")
async def conversation(conversation_id: str, request: MessageRequest):
    if conversation_id not in chat_agents:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    chat_agent = chat_agents[conversation_id]
    
    # TODO: Do verification + hadnle special cases
    
    if chat_agent.is_generating:
        raise HTTPException(status_code=409, detail="Agent is currently generating a response. Please wait.")
    
    async def generate_response():
        try:
            async for chunk in chat_agent.send_user_input(request.message):
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )
