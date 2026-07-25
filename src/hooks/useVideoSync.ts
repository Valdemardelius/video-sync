import { useEffect, useRef } from 'react';

interface PlayerControls {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
}


export function useVideoSync(ws: WebSocket, player: PlayerControls) {
  const isRemoteAction = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === 'chat' || message.type === 'participants' || message.type === 'kicked') {
        return; 
      }

      isRemoteAction.current = true;

      if (message.type === 'play') {
        player.seekTo(message.time);
        player.play();
      } else if (message.type === 'pause') {
        player.seekTo(message.time);
        player.pause();
      } else if (message.type === 'seek') {
        player.seekTo(message.time);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws, player]);

  const sendMessage = (data: object) => {
    ws.send(JSON.stringify(data));
  };

  const handlePlay = () => {
    if (isRemoteAction.current) {
      isRemoteAction.current = false;
      return;
    }
    sendMessage({ type: 'play', time: player.getCurrentTime() });
  };

  const handlePause = () => {
    if (isRemoteAction.current) {
      isRemoteAction.current = false;
      return;
    }
    sendMessage({ type: 'pause', time: player.getCurrentTime() });
  };

  const handleSeeked = () => {
    if (isRemoteAction.current) {
      isRemoteAction.current = false;
      return;
    }
    sendMessage({ type: 'seek', time: player.getCurrentTime() });
  };

  const handlePlayButton = () => {
    sendMessage({ type: 'play', time: player.getCurrentTime() });
    isRemoteAction.current = true; 
    player.play();
  };

  const handlePauseButton = () => {
    sendMessage({ type: 'pause', time: player.getCurrentTime() });
    isRemoteAction.current = true; 
    player.pause();
  };

  return { handlePlay, handlePause, handleSeeked, handlePlayButton, handlePauseButton };
}
