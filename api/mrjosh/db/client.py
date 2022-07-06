import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


load_dotenv()
mjdbc = AsyncIOMotorClient(
    os.getenv("MJDB_CONNSTR"),
    connect=True
)["MrJosh"]