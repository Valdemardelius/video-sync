🎬 Video Sync App
Веб-приложение для совместного просмотра видео (YouTube / MP4) в реальном времени — с синхронизацией play/pause/перемотки, чатом и правами хоста.
🛠 Технологический стек
Frontend: React + TypeScript (Vite), Tailwind CSS, React Router, react-youtube
Backend: Python + FastAPI + WebSocket (данные в памяти, без БД)
Bot: Python + aiogram (в разработке)
🎯 Основные возможности
✅ Создание комнаты по ссылке на видео (YouTube или прямой MP4)
✅ Синхронизация play/pause/перемотки между всеми участниками комнаты в реальном времени
✅ Встроенный чат внутри комнаты
✅ Система прав хоста — только хост (или участник с выданным правом) может управлять плеером
✅ Хост может выдавать/забирать право управления и кикать участников
✅ Переключение светлой/тёмной темы
⬜ Telegram-бот для создания комнат и управления плеером
📁 Структура проекта
video-sync-app/
├── video-sync-app/          # Frontend (React + TS)
│   └── src/
│       ├── components/      # Компоненты (VideoPlayer, ThemeToggle...)
│       ├── hooks/           # Кастомные хуки (useRoom, useRoomSocket, useVideoSync...)
│       └── utils/           # Вспомогательные функции
└── video-sync-backend/      # Backend (FastAPI)
├── main.py               # Точка входа, подключение роутеров
├── models.py             # Pydantic-модели
├── state.py               # Хранилища в памяти + broadcast-логика
├── rooms_router.py        # REST: создание/получение комнат
└── websocket_router.py    # WebSocket: синхронизация, чат, права
🚀 Быстрый старт
Понадобятся два открытых терминала — один для бэкенда, один для фронтенда.
Backend
cd video-sync-backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate   # macOS/Linux
pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload
Бэкенд будет доступен на `http://127.0.0.1:8000` (документация API — `/docs`).
Frontend
cd video-sync-app
npm install
npm run dev
Сайт будет доступен на `http://localhost:5173`.
