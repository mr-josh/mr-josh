from azure.functions import HttpRequest, HttpResponse
from bson.objectid import ObjectId
from bson.json_util import dumps
from common.connections.db import dbc
from common.connections.fs import get_container_client, generate_sas_url

fsc = get_container_client("dots")


async def plinko_get(req: HttpRequest):
    try:
        last_seen = req.params.get("last", "000000000000000000000000")
        last_seen = ObjectId(last_seen)
    except:
        return HttpResponse("Invalid last seen id", status_code=400)

    latest = dbc["Dots"]["Plinko"].find_one(
        {"_id": {"$gt": last_seen}},
        sort=[("_id", -1)],
    )

    if not latest:
        return HttpResponse("No new data", status_code=204)

    blob = fsc.get_blob_client(latest["sim"])
    url = generate_sas_url(blob)
    latest["sim"] = url

    return HttpResponse(dumps(latest), status_code=200)
