from pydantic import BaseModel


class User(BaseModel):
    source: str
    id: str
    label: str


class Request(BaseModel):
    user: User
    amount: int
