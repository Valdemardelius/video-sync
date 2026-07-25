import { useEffect, useRef, useState } from 'react';

interface Participant {
  user: string;
  can_control: boolean;
  is_host: boolean;
}

export function useRoomSocket(roomId: string | undefined, username: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', user: username }));
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
    });

    return () => ws.close();
  }, [roomId, username]);

  return { ws: wsRef.current, wsReady, participants, kicked };
}