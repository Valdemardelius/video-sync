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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-4 space-y-3">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">💬 Чат</h3>

      <div className="h-48 overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-900 p-3 space-y-1.5">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-16">
            Сообщений пока нет
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold text-purple-600 dark:text-purple-400">{m.user}:</span>{' '}
            <span className="text-gray-700 dark:text-gray-300">{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать сообщение..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all active:scale-[0.98]"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}