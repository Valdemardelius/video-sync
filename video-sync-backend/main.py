from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rooms_router import router as rooms_router
from websocket_router import router as websocket_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms_router)
app.include_router(websocket_router)