import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type KPI } from "../types/types";
import { fetchCompanies, fetchCompanyKpiDataset } from "../services/kpiService";
import { KPIChart } from "../components/KPIChart";
import { downloadCsv } from "../services/csvService";

export function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedKpiType, setSelectedKpiType] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const { data: kpiData } = useQuery({
    queryKey: [selectedCompany],
    queryFn: () =>
      fetchCompanyKpiDataset(
        selectedCompany,
        selectedSector,
        selectedKpiType,
        dateStart,
        dateEnd,
      ),
    enabled: selectedCompany !== "",
  });

  const allKpis = useMemo<KPI[]>(
    () => (Array.isArray(kpiData) ? kpiData : []),
    [kpiData],
  );

  const availableKpiTypes = useMemo(
    () => Array.from(new Set(allKpis.map((item) => item.kpi))),
    [allKpis],
  );

  const availableSectors = useMemo(
    () => Array.from(new Set(allKpis.map((item) => item.sector))),
    [allKpis],
  );

  const filteredKpis = useMemo(
    () =>
      allKpis.filter((item) => {
        const itemDate = new Date(item.period_end);
        const matchesDateStart = !dateStart || itemDate >= new Date(dateStart);
        const matchesDateEnd = !dateEnd || itemDate <= new Date(dateEnd);
        const matchesKpi = !selectedKpiType || item.kpi === selectedKpiType;
        const matchesSector = !selectedSector || item.sector === selectedSector;

        return (
          matchesKpi && matchesSector && matchesDateStart && matchesDateEnd
        );
      }),
    [allKpis, selectedKpiType, selectedSector, dateStart, dateEnd],
  );

  useEffect(() => {
    if (!selectedCompany || allKpis.length === 0) return;

    if (selectedCompany) {
      const kpiTypes = Array.from(new Set(allKpis.map((item) => item.kpi)));
      const sectors = Array.from(new Set(allKpis.map((item) => item.sector)));

      setSelectedKpiType(kpiTypes.length > 0 ? kpiTypes[0] : "");
      setSelectedSector(sectors.length > 0 ? sectors[0] : "");
    }
  }, [selectedCompany, allKpis]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
    // setDateStart("");
    // setDateEnd("");
    // Keeping the date range on company switch can be useful to compare
    // company perfomances on the same date range
  };

  const handleKpiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKpiType(e.target.value);
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(e.target.value);
  };

  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStart(e.target.value);
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };

  return (
    <div>
      <h1>KPI Dashboard</h1>
      <h3>Visualize interactive dashboards of companies' KPIs.</h3>

      <label htmlFor="company">Company: </label>
      <select
        id="company"
        value={selectedCompany}
        onChange={handleCompanyChange}
      >
        <option value="">-- Choose a company --</option>
        {companies.map((company: string) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      {selectedCompany && (
        <>
          {availableKpiTypes && (
            <div>
              <label htmlFor="kpi_type">KPIs: </label>
              <select
                id="kpi_type"
                value={selectedKpiType}
                onChange={handleKpiChange}
              >
                {availableKpiTypes.map((kpi_type: string) => (
                  <option key={kpi_type} value={kpi_type}>
                    {kpi_type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {availableSectors && (
            <div>
              <label htmlFor="sector">Sector: </label>
              <select
                id="sector"
                value={selectedSector}
                onChange={handleSectorChange}
              >
                {availableSectors.map((sector: string) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <label htmlFor="date_start">Date Start: </label>
            <input
              id="date_start"
              type="date"
              value={dateStart}
              onChange={handleDateStartChange}
            />

            <label htmlFor="date_end" style={{ marginLeft: "16px" }}>
              Date End:{" "}
            </label>
            <input
              id="date_end"
              type="date"
              value={dateEnd}
              onChange={handleDateEndChange}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => downloadCsv(filteredKpis, selectedCompany)}
              disabled={filteredKpis.length === 0}
            >
              Export CSV for current view
            </button>
          </div>

          {filteredKpis.length > 0 && (
            <KPIChart
              data={filteredKpis}
              kpiType={selectedKpiType}
              company={selectedCompany}
              sector={selectedSector}
            />
          )}

          {filteredKpis.length === 0 && selectedCompany && (
            <p>No data available for selected filters.</p>
          )}
        </>
      )}
    </div>
  );
}
