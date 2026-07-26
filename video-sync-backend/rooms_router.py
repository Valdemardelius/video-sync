import uuid
from fastapi import APIRouter, HTTPException

from models import CreateRoomRequest
from state import rooms

router = APIRouter()


@router.post("/rooms")
def create_room(request: CreateRoomRequest):
    room_id = str(uuid.uuid4())[:8]
    host_token = str(uuid.uuid4())
    admin_token = str(uuid.uuid4())

    rooms[room_id] = {
        "video_url": request.video_url,
        "host_token": host_token,
        "admin_token": admin_token,
    }

    return {"room_id": room_id, "host_token": host_token, "admin_token": admin_token}


@router.get("/rooms/{room_id}")
def get_room(room_id: str):
    room = rooms.get(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"video_url": room["video_url"]}