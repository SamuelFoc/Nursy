from fastapi import APIRouter
from fastapi import Depends

from src.iqs_api.hooks.on_queue import on_queue
from src.iqs_api.hooks.on_role import on_role
from src.iqs_api.routers.admin_schema import AdminQueueSchema
from src.iqs_ws.queue import StateQueue

router = APIRouter()


@router.get('/', response_model=AdminQueueSchema)
async def get_whole_queue(queue: StateQueue = Depends(on_queue), current_user=Depends(on_role('admin'))) -> AdminQueueSchema:
    participants = queue.to_admin_queue()
    return AdminQueueSchema(participants=participants)
