import { useCallback, useState } from "react";
import { fetchSearchKpiDataset } from "../services/kpiService";
import { downloadCsv } from "../services/csvService";
import type { KPI } from "../types/types";
import { formatDate, formatNumber } from "../utils/utils";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const rows = searchQuery ? await fetchSearchKpiDataset(searchQuery) : [];
      setResults(rows);

      const failed_search = rows.length > 0 ? false : true;
      setFailedSearch(failed_search);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  });

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runSearch();
    },
    [runSearch],
  );

  return (
    <div>
      <h1>Search KPIs</h1>
      <h3>Search data for a specific company name, KPI, or sector.</h3>
      <div style={{ marginBottom: 12 }}>
        <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
          <label htmlFor="search">Search: </label>
          <input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="company name, kpi or sector"
          />

          <button
            style={{ marginLeft: 12 }}
            onClick={runSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => downloadCsv(results, searchQuery)}
          disabled={results.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div>
        <p>
          Results: <strong>{results.length}</strong>
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>Company</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>Ticker</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>Sector</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>KPI</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>
                Period End
              </th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>Value</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>Unit</th>
              <th style={{ border: "1px solid #ddd", padding: 6 }}>As of</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={`${r.ticker}-${i}`}>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {r.company_name ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {r.ticker ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {r.sector ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {r.kpi ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {formatDate(r.period_end) ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {formatNumber(r.value)}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {r.unit ?? ""}
                </td>
                <td style={{ border: "1px solid #eee", padding: 6 }}>
                  {formatDate(r.as_of) ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {failedSearch && <p>No results. Try a different search.</p>}
      </div>
    </div>
  );
}
