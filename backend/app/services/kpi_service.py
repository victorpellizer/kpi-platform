import csv
from pathlib import Path
from typing import Any


class KPIService:
    def __init__(self):
        self.csv_path = (
            Path(__file__).parent.parent.parent / "app/data" / "kpi_sample_2000.csv"
        )

    async def get_kpi_dataset(
        self,
        company_name: str | None = None,
        search_query: str | None = None,
    ) -> list[dict[str, Any]]:
        """
        Read KPI data from CSV file with optional filters.

        Args:
            company_name: Filter by company name

        Returns:
            List of KPI records of given company
        """
        results = []

        try:
            with open(self.csv_path, encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)

                for row in reader:
                    # Apply filters
                    if search_query and (
                        search_query.lower() not in row["sector"].lower()
                        and search_query.lower() not in row["kpi"].lower()
                        and search_query.lower() not in row["company_name"].lower()
                    ):
                        continue
                    if (
                        company_name
                        and row["company_name"].lower() != company_name.lower()
                    ):
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

    async def get_companies(self) -> list[str]:
        results = []

        try:
            with open(self.csv_path, encoding="utf-8") as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    company_name = row["company_name"]
                    if company_name in results:
                        continue

                    results.append(company_name)

        except FileNotFoundError:
            raise FileNotFoundError(f"CSV file not found at {self.csv_path}")

        return sorted(results)

    async def publish_kpi_estimate(self, payload: Any) -> dict[str, Any]:
        fieldnames = [
            "company_name",
            "ticker",
            "sector",
            "kpi",
            "period_start",
            "period_end",
            "period",
            "estimate_type",
            "value",
            "unit",
            "as_of",
        ]
        try:
            self.csv_path.parent.mkdir(parents=True, exist_ok=True)
            file_exists = self.csv_path.exists()

            with open(self.csv_path, mode="a", encoding="utf-8", newline="") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                if not file_exists:
                    writer.writeheader()

                writer.writerow(
                    {field: getattr(payload, field) for field in fieldnames}
                )

        except FileNotFoundError:
            raise FileNotFoundError(f"CSV file not found at {self.csv_path}")

        return {"status": "ok", "created": payload.company_name}
