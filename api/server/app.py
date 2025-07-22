import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from api.server.auth import decode_jwt
from api.server.web_socket_manager import ConnectionManager
from api.server.routes.anamnesis import router as anamnesis_router
from api.lex.lib.regex import ANAMNESIS_REGEX, QUESTION_REGEX

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

app = FastAPI()
manager = ConnectionManager()
app.include_router(anamnesis_router)

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket, token: str):
    logging.info(f"🔐 Incoming connection with token: {token}")

    user = decode_jwt(token)
    if not user:
        logging.warning("❌ Invalid JWT. Closing connection.")
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
            "code": "200",
            "flag": "",
            "message": initial_message
        })
        logging.info("🤖 Sent initial greeting to client.")

        while True:
            data = await websocket.receive_text()
            logging.info(f"📨 Received input: {data}")

            if not verification_agent.verify_input(chat_agent.history[-1]['content'], data):
                logging.warning("⚠️ Input failed verification. Sending warning to client.")
                await websocket.send_json({
                    "role": "system",
                    "code": "400",
                    "flag": "BAD INPUT",
                    "message": "⚠️ Unrelated or invalid input. Please rephrase."
                })
                continue

            # Get model response
            response = chat_agent.send_user_input(data)
            logging.info(f"💬 Agent response: {response}")

            # Extract and send follow-up question if present
            question = extractor.extract(response, QUESTION_REGEX)
            if question:
                logging.info(f"❓ Extracted follow-up question: {question}")
                await websocket.send_json({
                    "role": "nurse",
                    "code": "200",
                    "flag": "🚨 ATTENTION MODE 🚨" if "<LIFE THREATENING SITUATION>" in response else "",
                    "message": question,
                })

            # Handle end of diagnosis
            if "<DIAGNOSIS DONE>" in response:
                logging.info("✅ Diagnosis complete marker detected.")
                anamnesis_str = extractor.extract(response, ANAMNESIS_REGEX)

                if anamnesis_str:
                    logging.info("📄 Sending extracted anamnesis.")
                    await websocket.send_json({
                        "role": "system",
                        "code": "200",
                        "flag": "END",
                        "message": "Diagnosis completed.",
                        "payload": {
                            "raw_text": anamnesis_str
                        }
                    })
                break

    except WebSocketDisconnect:
        logging.info(f"🔌 Client disconnected: token={token}")
        manager.disconnect(token)

    except Exception as e:
        logging.exception(f"❌ Unhandled exception in WebSocket handler: {e}")
        await websocket.close(code=1011)
        manager.disconnect(token)
