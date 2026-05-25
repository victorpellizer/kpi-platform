export interface KPI {
  company_name: string;
  ticker: string;
  sector: string;
  kpi: string;
  period_start: string;
  period_end: string;
  period: string;
  estimate_type: string;
  value: number | null;
  unit: string;
  as_of: string;
}

export const SECTORS = [
  "E-commerce",
  "EdTech",
  "Fintech",
  "Gaming",
  "Marketplaces",
  "Software",
  "HealthTech",
  "Rideshare",
  "Cloud",
  "Restaurant Tech",
  "AdTech",
  "Cybersecurity",
  "Delivery",
  "Fitness",
  "Travel",
  "Social Media",
  "Entertainment",
  "Automotive",
];

export const KPI_TYPES = [
  "ASP ($)",
  "Global Net Added Subscribers",
  "Total Revenue ($MM)",
  "U.S. Net Added Subscribers",
  "Units Sold",
];
