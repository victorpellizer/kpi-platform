import type { KPI } from "../types/types";

export const downloadCsv = (rows: KPI[], selectedCompany: string) => {
  if (!rows.length) return;

  const headers = [
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
  ];

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((field) => {
          const value = (row as any)[field];
          return `"${String(value ?? "").replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kpi_export_${selectedCompany || "view"}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
