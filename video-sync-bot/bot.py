import os
import asyncio
import requests
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        "Привет! Я помогу создать комнату для совместного просмотра видео.\n\n"
        "Используй команду:\n/newroom <ссылка на видео>"
    )


@dp.message(Command("newroom"))
async def cmd_newroom(message: Message):
    parts = message.text.split(maxsplit=1)

    if len(parts) < 2:
        await message.answer("Укажи ссылку на видео после команды.\nПример: /newroom https://youtube.com/watch?v=...")
        return

    video_url = parts[1]
    response = requests.post(f"{API_URL}/rooms", json={"video_url": video_url})

    if response.status_code != 200:
        await message.answer("Не получилось создать комнату. Попробуй ещё раз.")
        return

    data = response.json()
    viewer_link = f"{FRONTEND_URL}/room/{data['room_id']}"
    admin_link = f"{viewer_link}?key={data['admin_token']}"
    host_link = f"{viewer_link}?key={data['host_token']}"

    await message.answer(
        "Комната создана! 🎬\n\n"
        f"👑 Твоя ссылка (хост):\n{host_link}\n\n"
        f"🛡️ Ссылка для админов:\n{admin_link}\n\n"
        f"👥 Обычная ссылка:\n{viewer_link}"
    )


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())