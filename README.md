# NexStock Pro

> *Smart Inventory. Seamless Orders. Total Control.*

A production-ready Inventory & Order Management System built with FastAPI (Python) and React (Vite), featuring a dark glassmorphism UI, PostgreSQL persistence, and Docker containerization.

**Live Demo:** [Frontend URL] | **API:** [Backend URL] | **Swagger Docs:** [Backend URL]/docs | **Docker Hub:** [Docker Hub Image URL]

---

## Tech Stack

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?style=flat)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=flat&logo=vercel)

## Features

- **Dashboard** — Real-time stats cards with animated counters, revenue chart, low stock alerts, recent orders
- **Product Management** — Full CRUD with search, category filter, low-stock toggle, stock status badges, pagination
- **Customer Directory** — CRUD with search, duplicate email detection, pagination
- **Order Management** — Multi-item order builder, stock validation, atomic inventory deduction, price snapshotting, order status state machine, cancel/delete with stock restoration
- **Responsive Dark UI** — Glassmorphism design with neon accents, framer-motion animations, mobile-responsive layout
- **Dockerized** — 3-container setup (PostgreSQL, FastAPI backend, nginx + React frontend)

## Business Rules

| Rule | Implementation |
|------|---------------|
| Product SKUs must be unique | DB unique constraint + service-level check on create/update |
| Customer emails must be unique | Same approach |
| Stock never goes negative | Validated before order creation; rollback on any item failure |
| Order price snapshot | `unit_price` recorded at order time, not affected by later price changes |
| Order status state machine | `pending → confirmed → shipped → delivered` (or cancel from any non-terminal state) |
| Cascade delete protection | Products/Customers with existing orders cannot be deleted (409 Conflict) |
| Stock restored on cancel/delete | Order delete restores all item quantities |

## Quick Start (Local Development)

**Prerequisites:** Docker & Docker Compose

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/nexstock-pro.git
cd nexstock-pro

# Configure environment
cp .env.example .env
# Edit .env if needed (defaults work for local dev)

# Build & start all services
docker-compose up --build
```

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Project Structure

```
nexstock-pro/
├── backend/                  # FastAPI + SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── routers/          # API route handlers
│   │   ├── services/         # Business logic layer
│   │   ├── config.py         # Environment-based settings
│   │   ├── database.py       # DB engine & session
│   │   ├── exceptions.py     # Custom error handlers
│   │   └── main.py           # FastAPI application entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── api/              # Axios service layer
│   │   ├── components/       # Reusable UI & feature components
│   │   ├── context/          # React Context state management
│   │   ├── hooks/            # Custom hooks (useDebounce)
│   │   ├── pages/            # Route-level page components
│   │   ├── styles/           # Global CSS & CSS Modules
│   │   └── utils/            # Formatters & Yup validators
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml        # Orchestrates all 3 services
├── .env.example              # Environment variable template
└── LICENSE
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| **Products** | | |
| POST | `/products` | Create product |
| GET | `/products` | List (search, category, low_stock, sort, paginate) |
| GET | `/products/{id}` | Get by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete (blocks if referenced by orders) |
| **Customers** | | |
| POST | `/customers` | Create customer |
| GET | `/customers` | List (search, paginate) |
| GET | `/customers/{id}` | Get with order count |
| DELETE | `/customers/{id}` | Delete (blocks if has orders) |
| **Orders** | | |
| POST | `/orders` | Create order (validates stock, deducts inventory) |
| GET | `/orders` | List (status, customer_id, date range, paginate) |
| GET | `/orders/{id}` | Full detail with customer + items |
| PUT | `/orders/{id}/status` | Advance status (state machine) |
| PUT | `/orders/{id}/cancel` | Cancel & restore stock |
| DELETE | `/orders/{id}` | Delete & restore stock |
| **Dashboard** | | |
| GET | `/dashboard/stats` | Aggregated stats & KPIs |

## Deployment Guide

### 1. GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexstock-pro.git
git push -u origin main
```

### 2. Backend — Render

**Option A — Buildpack (recommended):**
1. Create a **Render Web Service** (not Docker)
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add a **Render PostgreSQL** database
6. Set environment variables:
   - `DATABASE_URL` — Internal Render PostgreSQL URL
   - `ALLOWED_ORIGINS` — Your Vercel frontend URL
   - `DEBUG` — `false`

**Option B — Docker (if you prefer):**
1. Create a **Render Web Service** with **Docker** runtime type
2. Set **Root Directory** to `backend`
3. The included `Dockerfile` (Python 3.11-slim) will be used automatically

### 3. Frontend — Vercel

1. Import your GitHub repo on Vercel
2. **Root Directory:** `frontend`
3. **Framework:** Vite
4. **Environment Variable:**
   - `VITE_API_URL` — Your Render backend URL (e.g., `https://nexstock-backend.onrender.com`)
5. Deploy — Vercel auto-detects `vercel.json` for SPA rewrites

### 4. Docker Hub

```bash
# Backend
docker build -t YOUR_DOCKER_USERNAME/nexstock-backend:latest ./backend
docker push YOUR_DOCKER_USERNAME/nexstock-backend:latest

# Run standalone
docker run -p 8001:8000 \
  -e DATABASE_URL="postgresql://user:pass@host/db" \
  YOUR_DOCKER_USERNAME/nexstock-backend:latest
```

### 5. Update These URLs in `README.md`

After deployment, replace the placeholders at the top:
- **Frontend URL:** `https://nexstock-pro.vercel.app`
- **Backend URL:** `https://nexstock-backend.onrender.com`
- **Docker Hub:** `https://hub.docker.com/r/YOUR_USERNAME/nexstock-backend`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `nexstock` | PostgreSQL database name |
| `POSTGRES_USER` | `nexstock_user` | PostgreSQL user |
| `POSTGRES_PASSWORD` | *(required)* | PostgreSQL password |
| `DATABASE_URL` | *(composed)* | Full connection string |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS origins |
| `DEBUG` | `false` | Debug mode |
| `VITE_API_URL` | `http://localhost:8000` | Backend URL for frontend |

## License

MIT — see [LICENSE](LICENSE)
