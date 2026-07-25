from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from state import room_participants, room_hosts, broadcast, participants_list

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()

    try:
        join_data = await websocket.receive_json()
    except WebSocketDisconnect:
        return

    username = join_data["user"]

    if room_id not in room_participants:
        room_participants[room_id] = {}

    if room_id not in room_hosts:
        room_hosts[room_id] = username

    is_host = username == room_hosts[room_id]

    existing = room_participants[room_id].get(username)
    can_control = existing["can_control"] if existing else is_host

    room_participants[room_id][username] = {
        "ws": websocket,
        "can_control": can_control,
        "is_host": is_host,
    }

    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            sender = room_participants[room_id].get(username)

            if msg_type in ("play", "pause", "seek"):
                if sender and (sender["is_host"] or sender["can_control"]):
                    await broadcast(room_id, data, exclude_user=username)

            elif msg_type == "chat":
                await broadcast(room_id, data, exclude_user=username)

            elif msg_type == "grant_control" and sender and sender["is_host"]:
                target = data.get("target")
                if target in room_participants[room_id]:
                    room_participants[room_id][target]["can_control"] = True
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "revoke_control" and sender and sender["is_host"]:
                target = data.get("target")
                if target in room_participants[room_id] and not room_participants[room_id][target]["is_host"]:
                    room_participants[room_id][target]["can_control"] = False
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "kick" and sender and sender["is_host"]:
                target = data.get("target")
                if target in room_participants[room_id] and target != username:
                    target_ws = room_participants[room_id][target]["ws"]
                    try:
                        await target_ws.send_json({"type": "kicked"})
                        await target_ws.close()
                    except Exception:
                        pass
                    del room_participants[room_id][target]
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

    except WebSocketDisconnect:
        current = room_participants.get(room_id, {}).get(username)
        if current and current["ws"] is websocket:
            del room_participants[room_id][username]
            await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})