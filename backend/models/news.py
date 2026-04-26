from pydantic import BaseModel

class Article(BaseModel):
    title:       str
    summary:     str
    source:      str
    url:         str
    published:   str
    image:       str | None = None