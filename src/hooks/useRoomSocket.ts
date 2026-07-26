import { useEffect, useRef, useState } from 'react';

interface Participant {
  user: string;
  is_host: boolean;
  is_admin: boolean;
  can_control: boolean;
}

export function useRoomSocket(
  roomId: string | undefined,
  username: string,
  token: string | null,
  onVideoChanged: (url: string) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', user: username, token }));
      setWsReady(true);
    };

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'participants') {
        setParticipants(message.list);
      }
      if (message.type === 'kicked') {
        setKicked(true);
      }
      if (message.type === 'video_changed') {
        onVideoChanged(message.video_url);
      }
    });

    return () => ws.close();
  }, [roomId, username, token]);

  return { ws: wsRef.current, wsReady, participants, kicked };
}