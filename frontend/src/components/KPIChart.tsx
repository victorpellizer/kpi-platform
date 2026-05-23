import { LineChart, Line } from "recharts";

export function KPIChart({ data }) {
  return (
    <LineChart data={data}>
      <Line type="monotone" dataKey="value" />
    </LineChart>
  );
}
