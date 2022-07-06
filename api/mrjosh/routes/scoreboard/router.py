from datetime import datetime
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from mrjosh.auth.dependency import this_user
from mrjosh.db.client import mjdbc

from .models.person import Person
from .models.score import Score, ScoreTemplate

scoreboard_router = APIRouter()


@scoreboard_router.put("/person")
async def add_player(person: Person, _=Depends(this_user)):
    result = await mjdbc["Person"].insert_one(
        {
            **person.dict(exclude_none=True),
            "last_scored": datetime.utcnow(),
        }
    )

    return {"person_id": str(result.inserted_id)}


@scoreboard_router.get("/people")
async def get_people(page: int = 0, size: int = 100, _=Depends(this_user)):
    _people = (
        await mjdbc["Person"]
        .find({})
        .sort("last_scored", -1)
        .skip(page * size)
        .to_list(size)
    )

    people = []
    for _person in _people:
        person = {
            "person_id": str(_person["_id"]),
            "name": f"{_person['name']}",
        }

        if hnb := _person["help"].get("name_brackets", None):
            person["name"] += f" ({hnb})"

        people.append(person)

    return people


@scoreboard_router.put("/score")
async def add_score(score: Score, _=Depends(this_user)):
    _score = score.dict()
    _score["person"] = ObjectId(_score["person"])

    check = await mjdbc["Person"].find_one(_score["person"])

    if not check:
        raise HTTPException(status_code=400, detail="Person doesn't exist")

    await mjdbc["Person"].update_one(
        {"_id": _score["person"]},
        {"$set": {"last_scored": datetime.utcnow()}},
    )

    result = await mjdbc["Score"].insert_one(_score)

    return {"score_id": str(result.inserted_id)}


@scoreboard_router.get("/score")
async def get_scores(page: int = 0, size: int = 100, order: int = -1):
    if order != -1 and order != 1:
        raise HTTPException(status_code=400, detail="Invalid order")

    _scores = (
        await mjdbc["Score"]
        .aggregate(
            [
                {"$group": {"_id": "$person", "score": {"$sum": "$score"}}},
                {"$sort": {"score": order}},
                {"$skip": page * size},
                {
                    "$lookup": {
                        "from": "Person",
                        "localField": "_id",
                        "foreignField": "_id",
                        "as": "_person",
                    }
                },
            ]
        )
        .to_list(size)
    )

    scores = []
    for _score in _scores:
        _score["_id"] = str(_score["_id"])
        _score["person"] = _score["_person"][0]["name"][:1] + _score["_id"][-4:]
        if hnb := _score["_person"][0]["help"].get("name_brackets", None):
            _score["person"] += f" ({hnb})"
        del _score["_person"]

        scores.append(_score)

    return scores


@scoreboard_router.get("/score/full")
async def get_scores(
    page: int = 0, size: int = 100, order: int = -1, _=Depends(this_user)
):
    if order != -1 and order != 1:
        raise HTTPException(status_code=400, detail="Invalid order")

    _scores = (
        await mjdbc["Score"]
        .aggregate(
            [
                {"$group": {"_id": "$person", "score": {"$sum": "$score"}}},
                {"$sort": {"score": order}},
                {"$skip": page * size},
                {
                    "$lookup": {
                        "from": "Person",
                        "localField": "_id",
                        "foreignField": "_id",
                        "as": "_person",
                    }
                },
            ]
        )
        .to_list(size)
    )

    scores = []
    for _score in _scores:
        _score["_id"] = str(_score["_id"])
        _score["person"] = _score["_person"][0]["name"]
        if hnb := _score["_person"][0]["help"].get("name_brackets", None):
            _score["person"] += f" ({hnb})"
        del _score["_person"]

        scores.append(_score)

    return scores
