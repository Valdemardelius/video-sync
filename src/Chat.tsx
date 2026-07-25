import { useState, useEffect } from 'react';

interface ChatMessage {
  user: string;
  text: string;
}

interface ChatProps {
  ws: WebSocket;
}

export default function Chat({ ws }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [username] = useState(() => `User${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === 'chat') {
        setMessages((prev) => [...prev, { user: message.user, text: message.text }]);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws]);

  const handleSend = () => {
    if (!text.trim()) return;

    const message = { type: 'chat', user: username, text };
    ws.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { user: username, text }]);
    setText('');
  };

  return (
    <div>
      <h3>Чат</h3>
      <div style={{ border: '1px solid #ccc', height: '200px', overflowY: 'auto', padding: '8px' }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.user}:</strong> {m.text}
          </div>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Написать сообщение..."
      />
      <button onClick={handleSend}>Отправить</button>
    </div>
  );
}