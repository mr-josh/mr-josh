import json
import logging
import struct
from io import BytesIO

import azure.functions as func
from pydantic import ValidationError
from common.connections.db import dbc
from common.connections.fs import get_container_client
from common.models.plinko import Request

from .helpers.simulator import PlinkoSimulation

fsc = get_container_client("dots")


async def main(msg: func.ServiceBusMessage):
    try:
        request = Request.parse_obj(json.loads(msg.get_body().decode("utf-8")))
    except ValidationError as e:
        logging.error("Invalid request")
        logging.exception(e)
        return

    sim = PlinkoSimulation(ball_count=request.amount)

    # Run the simulation
    with BytesIO() as f:
        # Write an unsigned 32-bit integer for the number of pegs
        total_pegs = len(sim.pegs)
        f.write(struct.pack("I", total_pegs))

        # Write the pegs 2 32-bit floats for each peg
        for peg in sim.pegs:
            x = peg.body.position.x
            y = peg.body.position.y

            f.write(struct.pack("f", x))
            f.write(struct.pack("f", y))

        # Calculate the frames
        frames = []
        frame_count = 0
        while len(sim.balls) > 0 and frame_count < 3000:
            frames.append(sim.step())

            frame_count += 1

        if frame_count == 3000:
            print("Simulation timed out")

        logging.info(
            f"{request.user.label} Scored: {len(sim.scored)} out of {request.amount} "
            f"({len(sim.scored) / request.amount * 100}%)"
        )

        # Write an unsigned 32-bit integer for the number of frames
        f.write(struct.pack("I", len(frames)))

        # Write the frames
        for frame in frames:
            # Write an unsigned 32-bit integer for the number of balls in this frame
            f.write(struct.pack("I", len(frame)))

            for ball in frame:
                f.write(struct.pack("f", ball["x"]))
                f.write(struct.pack("f", ball["y"]))

    # Start a mongo transaction to save the simulation
    async with await dbc.start_session() as s:
        async with s.start_transaction():
            # Save the simulation
            record = await dbc["simulations"].insert_one(
                {
                    "user": request.user.dict(),
                    "amount": request.amount,
                    "scored": len(sim.scored),
                },
                session=s,
            )

            # Save the frames
            blob = fsc.upload_blob(
                name=f"plinko/sims/{str(record.inserted_id)}.bin",
                data=f.getvalue(),
            )

            # Update the record with the blob url
            await dbc["simulations"].update_one(
                {"_id": record.inserted_id},
                {"$set": {"sim": blob.url}},
                session=s,
            )
