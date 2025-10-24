from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ReportSummary(BaseModel):
    physical: str
    reserved: str
    available: str
    consumed: str

class ReportHistoryItem(BaseModel):
    date: datetime
    balance: float

class ReportForecast(BaseModel):
    stock: str
    avg_daily_consumption: str
    coverage_days: float | None
    depletion_date: datetime | None
