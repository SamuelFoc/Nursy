import asyncio
import websockets
import json
import os
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

# Configuration
JWT_TOKEN = os.getenv("CHAT_JWT")
if not JWT_TOKEN:
    raise RuntimeError("❌ CHAT_JWT environment variable not set.")

HOST = os.getenv("CHAT_HOST", "localhost")
PORT = os.getenv("CHAT_PORT", "8000")
URI = f"ws://{HOST}:{PORT}/ws/chat?token={JWT_TOKEN}"


async def chat():
    try:
        async with websockets.connect(URI) as ws:
            print("🩺 Connected to remote nurse...\n")

            # Initial nurse message
            first = await ws.recv()
            print("🤖 Nurse:", json.loads(first).get("message"))

            while True:
                print("\n📝 Your response:")
                user_input = input("> ")

                await ws.send(user_input)

                while True:
                    raw = await ws.recv()
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError as e:
                        print("❌ Failed to decode server response:")
                        print(f"Raw: {raw}")
                        raise e  # or exit

                    if data.get("role") == "nurse":
                        print("\n🤖 Nurse:", data["message"])
                        if "question" in data:
                            print("❓", data["question"])
                        break

                    elif data.get("role") == "system" and data.get("type") == "anamnesis":
                        print("\n🧾 Received raw anamnesis from server:")
                        print(data["payload"]["raw_text"])

                    elif data.get("role") == "system" and data.get("type") == "end":
                        print("\n✅ Conversation ended.")
                        return

                    elif data.get("role") == "system":
                        print("\n⚠️", data["message"])
                        break

    except websockets.exceptions.InvalidStatusCode as e:
        print(f"❌ WebSocket connection failed: HTTP {e.status_code}")
        if e.status_code == 403:
            print("🔐 Likely JWT issue. Check your token.")
        elif e.status_code == 404:
            print("📭 Endpoint not found. Is the server running?")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    asyncio.run(chat())
