from azure.functions import HttpRequest, HttpResponse
from common.connections.db import dbc


async def plinko_get(req: HttpRequest):
    return HttpResponse("Plinko GET request")
