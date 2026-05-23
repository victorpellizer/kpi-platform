import { useQuery } from "@tanstack/react-query";
import { fetchKpis } from "../services/kpiService";
// import { KPIChart } from "../components/KPIChart";

export function Dashboard() {
  const companyName = "MediCare Online"; // depois pode vir de input/route

  const { data } = useQuery({
    queryKey: [companyName],
    queryFn: () => fetchKpis(companyName),
  });

  return (
    <div>
      <h1>Company: {data}</h1>
      {/* <KPIChart data={data || []} /> */}
    </div>
  );
}
