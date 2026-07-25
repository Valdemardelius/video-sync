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
    <div>
      {youtubeId ? (
        <YouTube
          videoId={youtubeId}
          onReady={player.onYouTubeReady}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      ) : (
        <video
          ref={player.mp4Ref}
          src={videoUrl}
          width="640"
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeeked}
        />
      )}

      <div>
        <button onClick={handlePlayButton}>Play</button>
        <button onClick={handlePauseButton}>Pause</button>
      </div>
    </div>
  );
}