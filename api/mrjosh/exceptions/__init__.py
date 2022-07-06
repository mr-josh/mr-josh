from bson.errors import InvalidId
from fastapi import FastAPI

from .objectid import objectId_exception_handler


def register_exceptions(app: FastAPI):
    app.add_exception_handler(InvalidId, objectId_exception_handler)
