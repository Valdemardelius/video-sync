from fastapi import WebSocket

# Данные о самих комнатах: room_id -> {"video_url": "..."}
rooms: dict[str, dict] = {}

# Кто сейчас подключён к комнате:
# room_id -> { username: {"ws": WebSocket, "can_control": bool, "is_host": bool} }
room_participants: dict[str, dict[str, dict]] = {}

# Хост комнаты назначается один раз навсегда: room_id -> username
room_hosts: dict[str, str] = {}


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
        {"user": username, "can_control": info["can_control"], "is_host": info["is_host"]}
        for username, info in participants.items()
    ]