"""Plinko API
=============
"""

from azure.functions import HttpRequest, HttpResponse

from .helpers.methods.get import plinko_get
from .helpers.methods.post import plinko_post


async def main(req: HttpRequest) -> HttpResponse:
    if req.method == "GET":
        return await plinko_get(req)
    
    if req.method == "POST":
        return await plinko_post(req)

    return HttpResponse(
        "Method not allowed",
        status_code=405,
    )
