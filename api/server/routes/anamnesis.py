from fastapi import APIRouter, Request
from datetime import datetime
import os

router = APIRouter()

@router.post("/api/anamnesis/upload")
async def upload_anamnesis(request: Request):
    payload = await request.json()
    ciphertext = payload.get("ciphertext")

    if not ciphertext:
        return {"error": "Missing ciphertext"}

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"patients/anamnesis-{timestamp}.enc.json"

    os.makedirs("patients", exist_ok=True)
    with open(filename, "w") as f:
        f.write(ciphertext)

    return {"status": "saved", "file": filename}