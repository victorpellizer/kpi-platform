# kpi-platform
Platform to display companies' KPIs, search based on KPI info and to create new KPI estimates, which also grant agentic access to data via MCP

# Installing
On project root run:

```bash
docker compose up --build
```

Docker may take a few minutes to finish the build

# Usage

With docker properly running, the app can be accessed at the url:

```text
http://localhost:5173/
```

## The initial page will be the dashboard
Other pages (Search, Publish) can be accessed on the page header

### Dashboard
- Choose the company which you want to visualize data from.

- After choosing your company, you may filter the KPIs, sector of the company (if applicable) and date range that you want to visualize.

### Search
- You may search for any KPIs related to a certain company name, kpi, or sector. The search engine is keyword friendly and case insensitive.

### Publish
- You are able to publish new KPIs on this interface.