import YouTube from 'react-youtube';
import { getYouTubeId } from '../utils/videoUtils';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { useVideoSync } from '../hooks/useVideoSync';

interface VideoPlayerProps {
  videoUrl: string;
  ws: WebSocket;
}

export default function VideoPlayer({ videoUrl, ws }: VideoPlayerProps) {
  const youtubeId = getYouTubeId(videoUrl);
  const player = useVideoPlayer(youtubeId);
  const { handlePlay, handlePause, handleSeeked, handlePlayButton, handlePauseButton } =
    useVideoSync(ws, player);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-4 space-y-4">
      <div className="rounded-xl overflow-hidden aspect-video bg-black">
        {youtubeId ? (
          <YouTube
            videoId={youtubeId}
            onReady={player.onYouTubeReady}
            onPlay={handlePlay}
            onPause={handlePause}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        ) : (
          <video
            ref={player.mp4Ref}
            src={videoUrl}
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeeked}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePlayButton}
          className="flex-1 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all active:scale-[0.98]"
        >
          ▶ Play
        </button>
        <button
          onClick={handlePauseButton}
          className="flex-1 py-2 rounded-xl font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all active:scale-[0.98]"
        >
          ⏸ Pause
        </button>
      </div>
    </div>
  );
}