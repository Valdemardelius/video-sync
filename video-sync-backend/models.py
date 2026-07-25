from pydantic import BaseModel


class CreateRoomRequest(BaseModel):
    video_url: str