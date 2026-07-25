import uuid
from fastapi import APIRouter, HTTPException

from models import CreateRoomRequest
from state import rooms

router = APIRouter()


@router.post("/rooms")
def create_room(request: CreateRoomRequest):
    room_id = str(uuid.uuid4())[:8]
    rooms[room_id] = {"video_url": request.video_url}
    return {"room_id": room_id}


@router.get("/rooms/{room_id}")
def get_room(room_id: str):
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room