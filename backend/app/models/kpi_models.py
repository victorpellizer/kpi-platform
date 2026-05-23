from app.core.database import Base
from sqlalchemy import TIMESTAMP, Column, Numeric, String
from sqlalchemy.dialects.postgresql import UUID


class KPIMetric(Base):
    __tablename__ = "kpi_data"

    id = Column(UUID(as_uuid=True), primary_key=True)
    company_name = Column(String(100))
    ticker = Column(String(10))
    sector = Column(String(50))
    kpi = Column(String(50))
    period_start = Column(TIMESTAMP)
    period_end = Column(TIMESTAMP)
    period = Column(String(10))
    estimate_type = Column(String(100))
    value = Column(Numeric)
    unit = Column(String(10))
    as_of = Column(TIMESTAMP)
