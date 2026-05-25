import { api } from "../api/client";
import type { KPI } from "../types/types";

export interface KPICreate {
  company_name: string;
  ticker: string;
  sector: string;
  kpi: string;
  period_start: string;
  period_end: string;
  period: string;
  estimate_type: string;
  value: number;
  unit: string;
  as_of: string;
}

export const publishKpiEstimate = async (payload: KPICreate) => {
  const response = await api.post("/kpi/dataset", payload);
  return response.data;
};

export const fetchCompanyKpiDataset = async (
  companyName: string,
  sector?: string,
  kpiType?: string,
  dateStart?: string,
  dateEnd?: string,
): Promise<KPI[]> => {
  const response = await api.get("/kpi/dataset", {
    params: {
      company_name: companyName,
      sector,
      kpi: kpiType,
      date_start: dateStart,
      date_end: dateEnd,
    },
  });
  return response.data;
};

export const fetchSearchKpiDataset = async (
  searchQuery: string,
): Promise<KPI[]> => {
  const response = await api.get("/kpi/dataset", {
    params: {
      search_query: searchQuery,
    },
  });
  return response.data;
};

export const fetchCompanies = async () => {
  const response = await api.get("/kpi/companies");
  return response.data;
};
