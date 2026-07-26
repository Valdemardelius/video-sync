# 🎬 Video Sync App

Веб-приложение для совместного просмотра видео (YouTube / MP4) в реальном времени — с синхронизацией play/pause/перемотки, чатом, системой ролей и Telegram-ботом.

## 🛠 Технологический стек

**Frontend:** React + TypeScript (Vite), Tailwind CSS, React Router, react-youtube

**Backend:** Python + FastAPI + WebSocket (данные в памяти, без БД)

**Bot:** Python + aiogram

## 🎯 Основные возможности

✅ Создание комнаты по ссылке на видео (YouTube или прямой MP4)

✅ Синхронизация play/pause/перемотки между всеми участниками комнаты в реальном времени

✅ Встроенный чат внутри комнаты

✅ Система ролей: **хост** (создатель, полные права) → **админ** (назначается хостом или по ссылке) → **зритель** (может получить временное право на управление)

✅ Хост может назначать/снимать админов, выдавать/забирать право управления, кикать участников

✅ Смена видео в уже созданной комнате без пересоздания

✅ Переключение светлой/тёмной темы

✅ Telegram-бот — создание комнаты командой `/newroom`, присылает ссылки для хоста/админов/зрителей

## 📁 Структура проекта

```
video-sync-app/
├── video-sync-app/          # Frontend (React + TS)

│   └── src/

│       ├── components/      # VideoPlayer, Layout, ThemeToggle...

│       ├── hooks/           # useRoom, useRoomSocket, useVideoSync, useTheme...

│       └── utils/           # Вспомогательные функции

├── video-sync-backend/      # Backend (FastAPI)

│   ├── main.py               # Точка входа, подключение роутеров

│   ├── models.py             # Pydantic-модели

│   ├── state.py               # Хранилища в памяти + broadcast-логика

│   ├── rooms_router.py        # REST: создание/получение комнат

│   └── websocket_router.py    # WebSocket: синхронизация, чат, роли

└── video-sync-bot/          # Telegram-бот (aiogram)

    └── bot.py

```

## 🚀 Быстрый старт

Понадобятся три открытых терминала — бэкенд, фронтенд, бот.

### Backend

```bash
cd video-sync-backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install fastapi "uvicorn[standard]"
uvicorn main:app --reload
```

Бэкенд будет доступен на `http://127.0.0.1:8000` (документация API — `/docs`).

### Frontend

```bash
cd video-sync-app
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:5173`.

### Telegram-бот

```bash
cd video-sync-bot
python -m venv venv
venv\Scripts\activate
pip install aiogram requests python-dotenv
```

Создай файл `.env` рядом с `bot.py`:

```
BOT_TOKEN=твой_токен_от_BotFather
```

Запусти:

```bash
python bot.py
```
