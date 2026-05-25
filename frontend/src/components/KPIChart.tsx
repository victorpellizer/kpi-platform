import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type KPI } from "../types/types";
import { formatDate, formatNumber } from "../utils/utils";

interface KPIChartProps {
  data: KPI[];
  kpiType: string;
  company: string;
  sector: string;
}

export function KPIChart({ data, kpiType, company, sector }: KPIChartProps) {
  if (!data || data.length === 0) {
    return <p>No data available for chart</p>;
  }

  // Sort by period_end date or QTD as_of and format for chart
  const chartData = data
    .map((item) => {
      const isHistorical = item.estimate_type.toLowerCase() !== "qtd";
      const xSource = isHistorical ? item.period_end : item.as_of;

      return {
        ...item,
        date: formatDate(xSource),
        xDate: xSource,
        qtdValue: isHistorical ? null : item.value,
        historicalValue: isHistorical ? item.value : null,
      };
    })
    .sort((a, b) => new Date(a.xDate).getTime() - new Date(b.xDate).getTime());

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>
        {company} - {kpiType} - {sector}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatNumber} />
          <Tooltip
            formatter={(value) => formatNumber(Number(value))}
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            contentStyle={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
            }}
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                  >
                    <p>
                      <strong>Period End:</strong> {formatDate(data.date)}
                    </p>
                    <p>
                      <strong>Value:</strong>{" "}
                      {formatNumber(data.historicalValue ?? data.qtdValue)}
                    </p>
                    {data.asOf && (
                      <p>
                        <strong>As of:</strong> {formatDate(data.asOf)}
                      </p>
                    )}
                    <p>
                      <strong>Period:</strong> {data.period}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line dataKey="historicalValue" name="Historical" />
          <Line dataKey="qtdValue" name="QTD" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
