import { api } from "../api/client";

export const fetchKpis = async (companyName: string) => {
  const response = await api.get("/kpi", {
    params: {
      company_name: companyName,
    },
  });
  return response.data;
};
