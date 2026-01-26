# OWID Cube Dashboard

An analytics dashboard for exploring country-level CO₂ emissions data using DuckDB, Cube, and React.

This project demonstrates a modern analytics stack:

- DuckDB for local analytical storage
- Cube as a semantic layer and API
- A Vite + React + TypeScript frontend

## Tech Stack

- **DuckDB** – embedded analytical database
- **Cube** – analytics API / semantic layer
- **React** – frontend UI (Vite + TypeScript)

## Data

Source: **Our World in Data – CO₂ and Greenhouse Gas Emissions**

The raw CSV is stored locally and loaded into DuckDB. The DuckDB database file is reproducible via the seed script.

## Project Structure

```
owid-cube-dashboard/
├─ cube/          # Cube analytics API
├─ data/          # Raw CSV data (DuckDB database generated locally)
├─ scripts/       # Database seed script
└─ web/           # React frontend (Vite + TypeScript)
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

## Status

- DuckDB seeded and queryable
- Cube semantic model validated
- React frontend connected to Cube

Next:
- Country detail pages
- Time-series charts

