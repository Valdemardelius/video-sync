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
  const { ws, wsReady, kicked, participants } = useRoomSocket(roomId, username.current);
  const [joined, setJoined] = useState(false);
  const myself = participants.find((p) => p.user === username.current);
  const amIHost = myself?.is_host ?? false;

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (kicked) return <p className="text-center text-red-500 mt-10">Тебя удалили из комнаты</p>;
  if (!videoUrl || !wsReady) return <p className="text-center text-gray-500 mt-10">Загрузка...</p>;

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-8 space-y-4 text-center">
          <h1 className="text-xl font-bold">Комната: {roomId}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Браузер требует подтверждения перед запуском видео.
          </p>
          <button
            onClick={() => setJoined(true)}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Присоединиться к просмотру
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Комната: {roomId}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Твоё имя: {username.current}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">👥 Участники</h3>
        <ul className="space-y-1">
          {participants.map((p) => (
            <li key={p.user} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>
                {p.user} {p.is_host && '👑'} {p.can_control && !p.is_host && '🎮'}
              </span>

              {amIHost && p.user !== username.current && (
                <span className="flex gap-2">
                  <button
                    onClick={() => ws?.send(JSON.stringify({ type: p.can_control ? 'revoke_control' : 'grant_control', target: p.user }))}
                    className="text-xs px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {p.can_control ? 'Забрать право' : 'Дать право'}
                  </button>
                  <button
                    onClick={() => ws?.send(JSON.stringify({ type: 'kick', target: p.user }))}
                    className="text-xs px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                  >
                    Кикнуть
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <VideoPlayer videoUrl={videoUrl} ws={ws!} />
      <Chat ws={ws!} />
    </div>
  );
}