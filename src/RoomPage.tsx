import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';
import Chat from './Chat';
import { getUsername } from './utils/username';
import { useRoom } from './hooks/useRoom';
import { useRoomSocket } from './hooks/useRoomSocket';


export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const username = useRef(getUsername());

  const { videoUrl, error } = useRoom(roomId);
  const { ws, wsReady, kicked } = useRoomSocket(roomId, username.current);
  const [joined, setJoined] = useState(false);

  if (error) return <p>{error}</p>;
  if (kicked) return <p>Тебя удалили из комнаты</p>;
  if (!videoUrl || !wsReady) return <p>Загрузка...</p>;

  if (!joined) {
    return (
      <div>
        <h1>Комната: {roomId}</h1>
        <p>Браузер требует подтверждения перед запуском видео.</p>
        <button onClick={() => setJoined(true)}>Присоединиться к просмотру</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Комната: {roomId}</h1>
      <p>Твоё имя: {username.current}</p>
      <VideoPlayer videoUrl={videoUrl} ws={ws!} />
      <Chat ws={ws!} />
    </div>
  );
}