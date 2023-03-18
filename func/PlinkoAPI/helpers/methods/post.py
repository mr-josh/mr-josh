import os
import json
from azure.servicebus.aio import ServiceBusClient
from azure.servicebus import ServiceBusMessage

from azure.functions import HttpRequest, HttpResponse
from common.connections.db import dbc

QUEUE_NAME = "dots_plinko"


async def plinko_post(req: HttpRequest):
    if req.headers.get("plinko-srv-auth", None) != os.environ["PLINKO_POST_KEY"]:
        return HttpResponse("Unauthorized", status_code=401)

    async with ServiceBusClient.from_connection_string(
        conn_str=os.environ["QUEUE_CONNSTR"], logging_enable=True
    ) as queue_client:
        sender = queue_client.get_queue_sender(queue_name=QUEUE_NAME)

        async with sender:
            await sender.send_messages(ServiceBusMessage("Plinko POST request"))
    return HttpResponse("Plinko GET request")
