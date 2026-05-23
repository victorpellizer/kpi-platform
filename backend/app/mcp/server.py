from fastmcp import FastMCP
from services.kpi_service import KPIService

mcp = FastMCP("KPI Server")
service = KPIService()


@mcp.tool()
async def get_kpis(metric: str, start_date: str, end_date: str):
    return await service.get_kpis(start_date, end_date, metric)


@mcp.resource("kpi://available-metrics")
async def available_metrics():
    return {"metrics": ["mrr", "churn", "revenue"]}
