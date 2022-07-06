from pydantic import BaseModel


class ScoreTemplate(BaseModel):
    score: int
    reason: str


class Score(ScoreTemplate):
    person: str
