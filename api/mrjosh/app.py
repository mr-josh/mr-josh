from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .exceptions import register_exceptions
from .routes.scoreboard.router import scoreboard_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
        "https://www.mr-josh.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exceptions(app)

app.include_router(
    scoreboard_router,
    prefix="/scoreboard",
    tags=["scoreboard"],
)
