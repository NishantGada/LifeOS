from pydantic import BaseModel

class Stock(BaseModel):
    symbol:       str
    name:         str
    price:        float
    change:       float
    change_pct:   float
    volume:       str
    high:         float
    low:          float

class ExchangeData(BaseModel):
    exchange:     str
    stocks:       list[Stock]
    summary:      str
    as_of:        str