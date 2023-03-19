import logging
import os

from azure.functions import HttpRequest, HttpResponse
from azure.servicebus import ServiceBusMessage
from azure.servicebus.aio import ServiceBusClient
from common.connections.db import dbc
from common.models.plinko import Request
from pydantic import ValidationError

QUEUE_NAME = "dots_plinko"


async def plinko_post(req: HttpRequest):
    if req.headers.get("plinko-srv-auth", None) != os.environ["PLINKO_POST_KEY"]:
        return HttpResponse("Unauthorized", status_code=401)

    try:
        request = Request.parse_obj(req.get_json())
    except ValidationError as e:  # If pydantic validation fails
        logging.error("Validation error")
        logging.exception(e)
        return HttpResponse(f"Validation error:\n{e.json(indent=2)}", status_code=400)
    except ValueError as e:  # If json decode fails
        logging.error("Bad request")
        logging.exception(e)
        logging.debug(req.get_body())
        return HttpResponse(f"Bad request", status_code=400)

    async with ServiceBusClient.from_connection_string(
        conn_str=os.environ["QUEUE_CONNSTR"], logging_enable=True
    ) as queue_client:
        sender = queue_client.get_queue_sender(queue_name=QUEUE_NAME)

        async with sender:
            await sender.send_messages(
                ServiceBusMessage(request.json()),
            )

    return HttpResponse("OK", status_code=201)
