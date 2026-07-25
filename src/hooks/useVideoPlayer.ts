import { useRef, useCallback } from 'react';
import type { YouTubeProps } from 'react-youtube';

export function useVideoPlayer(youtubeId: string | null) {
  const mp4Ref = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<any>(null);

  const onYouTubeReady: YouTubeProps['onReady'] = (event) => {
    youtubePlayerRef.current = event.target;
  };
  const play = useCallback(() => {
    if (youtubeId) {
      youtubePlayerRef.current?.playVideo();
    } else {
      mp4Ref.current?.play().catch((err: Error) => {
        console.warn('Не удалось запустить автовоспроизведение:', err.message);
      });
    }
  }, [youtubeId]);

  const pause = useCallback(() => {
    if (youtubeId) {
      youtubePlayerRef.current?.pauseVideo();
    } else {
      mp4Ref.current?.pause();
    }
  }, [youtubeId]);

  const seekTo = useCallback((time: number) => {
    if (youtubeId) {
      youtubePlayerRef.current?.seekTo(time, true);
    } else if (mp4Ref.current) {
      mp4Ref.current.currentTime = time;
    }
  }, [youtubeId]);

  const getCurrentTime = useCallback((): number => {
    if (youtubeId) {
      return youtubePlayerRef.current?.getCurrentTime() ?? 0;
    }
    return mp4Ref.current?.currentTime ?? 0;
  }, [youtubeId]);

  return { mp4Ref, onYouTubeReady, play, pause, seekTo, getCurrentTime };
}