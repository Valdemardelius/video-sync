import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const response = await fetch('http://127.0.0.1:8000/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    const data = await response.json();
    navigate(`/room/${data.room_id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Video Sync App</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Смотрите видео вместе, синхронно, в реальном времени
          </p>
        </div>

        <input
          type="text"
          placeholder="Вставь ссылку на видео"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <button
          onClick={handleCreateRoom}
          className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Создать комнату
        </button>
      </div>
    </div>
  );
}