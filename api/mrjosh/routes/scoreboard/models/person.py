from pydantic import BaseModel


class Help(BaseModel):
    name_brackets: str | None
    known_from: str | None
    full_name: str | None


class Person(BaseModel):
    name: str
    help: Help
