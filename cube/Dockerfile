FROM node:22-slim

WORKDIR /app

# Install deps (cached)
COPY cube/package*.json ./
RUN npm ci

# Copy Cube app
COPY cube/ ./

# Copy DuckDB database into the image
RUN mkdir -p /data
COPY data/analytics.duckdb /data/analytics.duckdb

EXPOSE 4000

# Cube's recommended production command is usually `start`
CMD ["npm", "run", "start"]
