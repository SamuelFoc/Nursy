from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.server.auth import decode_jwt
from app.server.web_socket_manager import ConnectionManager
from app.server.routes.anamnesis import router as anamnesis_router
from app.lex.lib.regex import ANAMNESIS_REGEX, QUESTION_REGEX

app = FastAPI()
manager = ConnectionManager()

app.include_router(anamnesis_router)

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket, token: str):
    user = decode_jwt(token)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, token)
    session = manager.get_session(token)
    chat_agent = session["chat_agent"]
    verification_agent = session["verification_agent"]
    extractor = session["extractor"]

    try:
        # Initial system greeting
        initial_message = chat_agent.start_conversation(
            "What symptoms or concerns brought you in today?"
        )
        await websocket.send_json({
            "role": "nurse",
            "message": initial_message
        })

        while True:
            data = await websocket.receive_text()

            if not verification_agent.verify_input(chat_agent.history[-1]['content'], data):
                await websocket.send_json({
                    "role": "system",
                    "message": "⚠️ Unrelated or invalid input. Please rephrase."
                })
                continue

            # Get model response
            response = chat_agent.send_user_input(data)

            # Extract and send follow-up question if present
            question = extractor.extract(response, QUESTION_REGEX)
            if question:
                await websocket.send_json({
                    "role": "nurse",
                    "question": question
                })

            # Handle life-threatening marker
            if "<LIFE THREATENING SITUATION>" in response:
                await websocket.send_json({
                    "role": "nurse",
                    "message": "🚨 ATTENTION MODE 🚨"
                })

            # Handle end of diagnosis
            if "<DIAGNOSIS DONE>" in response:
                anamnesis_str = extractor.extract(response, ANAMNESIS_REGEX)

                if anamnesis_str:
                    await websocket.send_json({
                        "role": "system",
                        "type": "anamnesis",
                        "payload": {
                            "raw_text": anamnesis_str
                        }
                    })

                await websocket.send_json({
                    "role": "system",
                    "type": "end",
                    "message": "Diagnosis complete"
                })
                break

    except WebSocketDisconnect:
        manager.disconnect(token)