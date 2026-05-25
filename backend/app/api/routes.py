from app.services.kpi_service import KPIService
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/kpi", tags=["KPI"])
service = KPIService()


class KPIEstimateCreate(BaseModel):
    company_name: str
    ticker: str
    sector: str
    kpi: str
    period_start: str
    period_end: str
    period: str
    estimate_type: str
    value: float
    unit: str
    as_of: str


@router.post("/dataset")
async def publish_kpi_dataset(payload: KPIEstimateCreate):
    return await service.publish_kpi_estimate(payload)


@router.get("/dataset")
async def get_kpi_dataset(
    company_name: str | None = None,
    search_query: str | None = None,
):
    return await service.get_kpi_dataset(
        company_name=company_name,
        search_query=search_query,
    )


@router.get("/companies")
async def get_companies():
    return await service.get_companies()
