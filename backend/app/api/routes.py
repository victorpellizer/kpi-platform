from app.services.kpi_service import KPIService
from fastapi import APIRouter

router = APIRouter(prefix="/kpi", tags=["KPI"])
service = KPIService()


@router.get("")
async def get_kpis(
    company_name: str | None = None,
):
    return await service.get_kpis(company_name)
