import asyncio
import websockets
import json
import os
from dotenv import load_dotenv
from websockets.exceptions import InvalidStatusCode  # still valid in websockets <12.0

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
            first_data = json.loads(first)
            print("🤖 Nurse:", first_data.get("message", "No message received"))

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
                        raise e

                    role = data.get("role")

                    if role == "nurse":
                        print("\n🤖 Nurse:", data.get("flag"))
                        if "message" in data:
                            print("❓", data["message"])
                        break

                    elif role == "system" and data.get("flag") == "END":
                        print("\n🧾 Received raw anamnesis from server:")
                        payload = data.get("payload", {})
                        print(payload.get("raw_text", "[no raw text]"))
                        print("\n✅ Conversation ended.")

                    elif role == "system" and data.get("flag") == "BAD INPUT":
                        print("\n⚠️ System message:", data.get("message", "[no message]"))
                        break

                    else:
                        print("\n❓ Unknown message format:", json.dumps(data, indent=2))
                        break

    except InvalidStatusCode as e:
        print(f"❌ WebSocket connection failed: HTTP {e.status_code}")
        if e.status_code == 403:
            print("🔐 Likely JWT issue. Check your token.")
        elif e.status_code == 404:
            print("📭 Endpoint not found. Is the server running?")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    asyncio.run(chat())
