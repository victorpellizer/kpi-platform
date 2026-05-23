import csv
from pathlib import Path
from typing import Any


class KPIService:
    def __init__(self):
        # Path to the CSV file
        self.csv_path = (
            Path(__file__).parent.parent.parent / "media" / "kpi_sample_2000.csv"
        )

    async def get_kpis(
        self,
        company_name: str | None = None,
    ) -> list[dict[str, Any]]:
        """
        Read KPI data from CSV file with optional filters.

        Args:
            company_name: Filter by company name
            sector: Filter by sector
            kpi: Filter by KPI name

        Returns:
            List of KPI records matching the filters
        """
        results = []

        try:
            with open(self.csv_path, encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)

                for row in reader:
                    # Apply filters
                    if company_name and row["company_name"] != company_name:
                        continue

                    # Add the row to results
                    results.append(
                        {
                            "company_name": row["company_name"],
                            "ticker": row["ticker"],
                            "sector": row["sector"],
                            "kpi": row["kpi"],
                            "period_start": row["period_start"],
                            "period_end": row["period_end"],
                            "period": row["period"],
                            "estimate_type": row["estimate_type"],
                            "value": float(row["value"]) if row["value"] else None,
                            "unit": row["unit"],
                            "as_of": row["as_of"],
                        }
                    )

        except FileNotFoundError:
            raise FileNotFoundError(f"CSV file not found at {self.csv_path}")

        return results
