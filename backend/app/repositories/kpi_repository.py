from app.core.database import SessionLocal
from app.models.kpi_models import KPIMetric
from sqlalchemy import func, or_, select


class KPIRepository:
    def __init__(self, session=None):
        self.session = session or SessionLocal()

    def find_kpis(
        self,
        company_name=None,
        sector=None,
        kpi=None,
        start_date=None,
        end_date=None,
        search_query=None,
    ):
        stmt = select(KPIMetric)

        if company_name:
            stmt = stmt.where(
                func.lower(KPIMetric.company_name) == company_name.lower()
            )

        if sector:
            stmt = stmt.where(KPIMetric.sector == sector)

        if kpi:
            stmt = stmt.where(KPIMetric.kpi == kpi)

        if search_query:
            search_text = f"%{search_query.lower()}%"
            stmt = stmt.where(
                or_(
                    func.lower(KPIMetric.company_name).like(search_text),
                    func.lower(KPIMetric.sector).like(search_text),
                    func.lower(KPIMetric.kpi).like(search_text),
                )
            )

        if start_date:
            stmt = stmt.where(KPIMetric.period_end >= start_date)

        if end_date:
            stmt = stmt.where(KPIMetric.period_end <= end_date)

        return self.session.execute(stmt).scalars().all()

    def get_companies(self):
        stmt = (
            select(KPIMetric.company_name).distinct().order_by(KPIMetric.company_name)
        )
        return [row[0] for row in self.session.execute(stmt).all()]

    def create_kpi(self, payload: dict):
        record = KPIMetric(**payload)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return record
