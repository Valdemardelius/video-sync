from fastapi import WebSocket

# room_id -> {"video_url": str, "host_token": str, "admin_token": str}
rooms: dict[str, dict] = {}

# room_id -> { username: {"ws": WebSocket, "is_host": bool, "is_admin": bool, "can_control": bool} }
room_participants: dict[str, dict[str, dict]] = {}


async def broadcast(room_id: str, data: dict, exclude_user: str | None = None):
    participants = room_participants.get(room_id, {})
    for username, info in list(participants.items()):
        if username == exclude_user:
            continue
        try:
            await info["ws"].send_json(data)
        except Exception:
            pass


def participants_list(room_id: str):
    participants = room_participants.get(room_id, {})
    return [
        {
            "user": username,
            "is_host": info["is_host"],
            "is_admin": info["is_admin"],
            "can_control": info["can_control"],
        }
        for username, info in participants.items()
    ]