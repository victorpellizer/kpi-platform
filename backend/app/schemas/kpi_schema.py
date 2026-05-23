from datetime import datetime

from pydantic import BaseModel


class KPIResponse(BaseModel):
    name: str
    value: float
    date: datetime
