# OWID Cube Dashboard

An analytics dashboard for exploring country-level CO₂ emissions data using DuckDB, Cube, and React.

This project demonstrates a modern analytics stack:

- DuckDB for local analytical storage and analytics
- Cube as a semantic layer and analytics API
- A Vite + React + TypeScript frontend

## Live Demo (WIP)

Frontend (Vercel):  
https://owid-cube-dashboard.vercel.app/

> Note: The analytics backend is currently running locally.
> A fully hosted backend is planned so the demo can be accessed publicly.

## Tech Stack

- **DuckDB** – embedded analytical database
- **Cube** – analytics API / semantic layer
- **React** – frontend UI (Vite + TypeScript)

## Data

Source: **Our World in Data – CO₂ and Greenhouse Gas Emissions**

The raw CSV is stored locally and loaded into DuckDB.  
The DuckDB database file is reproducible via the provided seed script.

## Project Structure
```
owid-cube-dashboard/
├─ cube/ # Cube analytics API
├─ data/ # Raw CSV data (DuckDB database generated locally)
├─ scripts/ # Database seed script
└─ web/ # React frontend (Vite + TypeScript)
```

## Development Setup

### 1) Build the DuckDB database

From the project root:

```bash
duckdb data/analytics.duckdb < scripts/seed.sql
```

### 2) Start the Cube API

```bash
cd cube
npm install
npm run dev
```

Playground available at `http://localhost:4000`

### 3) Start the React frontend

```bash
cd web
npm install
npm run dev
```

## Deployment (WIP)

The frontend is deployed as a static Vite application on Vercel.

The analytics backend (Cube + DuckDB) currently runs locally during development.
A hosted backend deployment is planned so the dashboard can be accessed publicly
without requiring a local Cube instance.
