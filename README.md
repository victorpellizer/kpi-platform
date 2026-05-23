# kpi-platform
Platform to display companies' KPIs


# Como funciona

## Frontend

O React ficará disponível em:

```text
http://localhost:5173
```

## Backend

O FastAPI ficará disponível em:

```text
http://localhost:8000
```

## Banco PostgreSQL

```text
localhost:5432
```

## Redis

```text
localhost:6379
```

---

# Como iniciar tudo

Na raiz do projeto:

```bash
docker compose up --build
```

---

# Comunicação frontend -> backend

No frontend:

```typescript
baseURL: "http://localhost:8000"
```

O React fará chamadas para:

```text
GET http://localhost:8000/kpis
```

---

# Comunicação backend -> PostgreSQL

O backend usa:

```text
postgresql://postgres:postgres@postgres:5432/kpidb
```

Observe:

```text
@postgres
```

Este nome é o próprio nome do serviço Docker.

---

# Comunicação backend -> Redis

```text
redis://redis:6379
```

Também usando o nome do serviço Docker.

---

# Próximos arquivos necessários

## backend/Dockerfile

```dockerfile
FROM python:3.12

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

---

## frontend/Dockerfile

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

---

# Fluxo final

```text
Frontend React
    ↓
FastAPI Backend
    ↓
Service Layer
    ↓
PostgreSQL

LLM
    ↓
FastMCP
    ↓
Service Layer
    ↓
PostgreSQL
```

---

# Estrutura final recomendada

```text
kpi-platform/
│
├── frontend/
│   ├── Dockerfile
│   └── src/
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│
└── docker-compose.yml
```
