from fastapi import Request
from bson.errors import InvalidId
from fastapi.responses import JSONResponse


async def objectId_exception_handler(request: Request, exc: InvalidId):
    return JSONResponse(status_code=400, content={"message": "Invalid ObjectId"})
