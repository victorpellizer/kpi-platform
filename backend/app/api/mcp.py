from datetime import date

from fastmcp import FastMCP
from services.kpi_service import KPIService

mcp = FastMCP("KPI Server")
service = KPIService()


def _quarter_start(day: date) -> date:
    if day.month <= 3:
        return date(day.year, 1, 1)
    if day.month <= 6:
        return date(day.year, 4, 1)
    if day.month <= 9:
        return date(day.year, 7, 1)
    return date(day.year, 10, 1)


@mcp.tool()
async def list_companies() -> list[str]:
    return await service.get_companies()


@mcp.tool()
async def get_kpi_estimates(
    company_name: str | None = None,
    sector: str | None = None,
    kpi: str | None = None,
    date_start: str | None = None,
    date_end: str | None = None,
    search_query: str | None = None,
) -> list[dict]:
    return await service.get_kpi_dataset(
        company_name=company_name,
        sector=sector,
        kpi=kpi,
        date_start=date_start,
        date_end=date_end,
        search_query=search_query,
    )


@mcp.tool()
async def get_qtd_estimates(
    company_name: str,
    kpi: str | None = None,
    sector: str | None = None,
    as_of: str | None = None,
) -> dict:
    as_of_date = date.fromisoformat(as_of) if as_of else date.today()
    period_start = _quarter_start(as_of_date)

    rows = await service.get_kpi_dataset(
        company_name=company_name,
        sector=sector,
        kpi=kpi,
        date_start=period_start.isoformat(),
        date_end=as_of_date.isoformat(),
    )

    return {
        "company_name": company_name,
        "kpi": kpi,
        "sector": sector,
        "as_of": as_of_date.isoformat(),
        "quarter_start": period_start.isoformat(),
        "rows": rows,
    }


@mcp.tool()
async def list_metrics() -> list[str]:
    return [
        "ASP ($)",
        "Global Net Added Subscribers",
        "Total Revenue ($MM)",
        "U.S. Net Added Subscribers",
        "Units Sold",
    ]
