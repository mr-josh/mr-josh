import os
from motor.motor_asyncio import AsyncIOMotorClient

dbc = AsyncIOMotorClient(os.environ["DB_CONNSTR"])

__all__ = [
    "dbc",
]
