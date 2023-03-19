from pydantic import BaseModel


class User(BaseModel):
    source: str
    id: str
    label: str


class Config(BaseModel):
    ball_radius: int = 10
    peg_rows: int = 20
    pegs_per_row: int = 20
    peg_radius: int = 10
    win_width: int = 100


class Request(BaseModel):
    user: User
    amount: int
    config: Config = Config()
