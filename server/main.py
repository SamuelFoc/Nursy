from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.iqs_api.routers import chat_router
from src.iqs_api.routers import queue_router
from src.iqs_ws.queue import StateQueue

# ---- App setup ----

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # restrict in prod
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.state.queue = StateQueue()

# ---- Routes ----

app.include_router(chat_router.router, prefix='/api/chat')
app.include_router(queue_router.router, prefix='/api/queue')
