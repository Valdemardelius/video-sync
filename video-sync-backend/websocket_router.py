from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from state import rooms, room_participants, broadcast, participants_list

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()

    try:
        join_data = await websocket.receive_json()
    except WebSocketDisconnect:
        return

    username = join_data["user"]
    provided_token = join_data.get("token")

    room = rooms.get(room_id)

    is_host = bool(room and provided_token and provided_token == room["host_token"])
    is_admin = bool(room and provided_token and provided_token == room["admin_token"])

    if room_id not in room_participants:
        room_participants[room_id] = {}

    existing = room_participants[room_id].get(username)

    if is_host or is_admin:
        can_control = True
    elif existing:
        # Переподключение (например, обновление страницы) — сохраняем прежний статус
        is_admin = existing["is_admin"]
        can_control = existing["can_control"]
    else:
        can_control = False

    room_participants[room_id][username] = {
        "ws": websocket,
        "is_host": is_host,
        "is_admin": is_admin,
        "can_control": can_control,
    }

    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            sender = room_participants[room_id].get(username)
            sender_is_privileged = bool(sender and (sender["is_host"] or sender["is_admin"]))

            if msg_type in ("play", "pause", "seek"):
                if sender and (sender_is_privileged or sender["can_control"]):
                    await broadcast(room_id, data, exclude_user=username)

            elif msg_type == "chat":
                await broadcast(room_id, data, exclude_user=username)

            elif msg_type == "change_video":
                if sender_is_privileged and room:
                    new_url = data.get("video_url")
                    if new_url:
                        room["video_url"] = new_url
                        await broadcast(room_id, {"type": "video_changed", "video_url": new_url})

            elif msg_type == "grant_control" and sender_is_privileged:
                target = data.get("target")
                target_info = room_participants[room_id].get(target)
                if target_info and not target_info["is_host"]:
                    target_info["can_control"] = True
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "revoke_control" and sender_is_privileged:
                target = data.get("target")
                target_info = room_participants[room_id].get(target)
                if target_info and not target_info["is_host"] and not target_info["is_admin"]:
                    target_info["can_control"] = False
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "make_admin" and sender and sender["is_host"]:
                target = data.get("target")
                target_info = room_participants[room_id].get(target)
                if target_info and not target_info["is_host"]:
                    target_info["is_admin"] = True
                    target_info["can_control"] = True
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "demote_admin" and sender and sender["is_host"]:
                target = data.get("target")
                target_info = room_participants[room_id].get(target)
                if target_info and not target_info["is_host"]:
                    target_info["is_admin"] = False
                    target_info["can_control"] = False
                    await broadcast(room_id, {"type": "participants", "list": participants_list(room_id)})

            elif msg_type == "kick":
                target = data.get("target")
                target_info = room_participants[room_id].get(target)

                if target_info and sender and target != username:
                    host_can_kick = sender["is_host"]
                    admin_can_kick_viewer = (
                        sender["is_admin"] and not target_info["is_host"] and not target_info["is_admin"]
                    )

                    if host_can_kick or admin_can_kick_viewer:
                        target_ws = target_info["ws"]
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