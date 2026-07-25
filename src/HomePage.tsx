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
    <div>
      <h1>Video Sync App</h1>
      <input
        type="text"
        placeholder="Вставь ссылку на видео"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Создать комнату</button>
    </div>
  );
}