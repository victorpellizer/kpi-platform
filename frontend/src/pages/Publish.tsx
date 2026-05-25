import { useState } from "react";
import { publishKpiEstimate } from "../services/kpiService";
import type { KPICreate } from "../services/kpiService";

const initialForm: KPICreate = {
  company_name: "",
  ticker: "",
  sector: "",
  kpi: "",
  period_start: "",
  period_end: "",
  period: "",
  estimate_type: "",
  value: 0,
  unit: "",
  as_of: "",
};

export function Publish() {
  const [form, setForm] = useState<KPICreate>(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof KPICreate, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await publishKpiEstimate(form);
      setStatus("Estimate published successfully.");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("Failed to publish estimate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Publish KPIs</h1>
      <h3>Publish new KPI estimates for companies.</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Company{" "}
            <input
              value={form.company_name}
              onChange={(e) => setField("company_name", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Ticker{" "}
            <input
              value={form.ticker}
              onChange={(e) => setField("ticker", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Sector{" "}
            <input
              value={form.sector}
              onChange={(e) => setField("sector", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            KPI{" "}
            <input
              value={form.kpi}
              onChange={(e) => setField("kpi", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Value{" "}
            <input
              type="number"
              step="any"
              value={form.value}
              onChange={(e) => setField("value", Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Unit{" "}
            <input
              value={form.unit}
              onChange={(e) => setField("unit", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Estimate Type{" "}
            <input
              value={form.estimate_type}
              onChange={(e) => setField("estimate_type", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Period Start{" "}
            <input
              type="date"
              value={form.period_start}
              onChange={(e) => setField("period_start", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Period End{" "}
            <input
              type="date"
              value={form.period_end}
              onChange={(e) => setField("period_end", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Period{" "}
            <input
              value={form.period}
              onChange={(e) => setField("period", e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            As of{" "}
            <input
              type="date"
              value={form.as_of}
              onChange={(e) => setField("as_of", e.target.value)}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Estimate"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
