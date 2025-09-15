from fastapi import Request

from src.iqs_ws.queue import StateQueue


def use_queue(request: Request) -> StateQueue:
    return request.app.state.queue  # type: ignore[attr-defined]
