import { useEffect, useState } from 'react';

interface Room {
  video_url: string;
}

export function useRoom(roomId: string | undefined) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    fetch(`http://127.0.0.1:8000/rooms/${roomId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Комната не найдена');
        return response.json();
      })
      .then((data: Room) => setVideoUrl(data.video_url))
      .catch((err) => setError(err.message));
  }, [roomId]);

  return { videoUrl, error };
}