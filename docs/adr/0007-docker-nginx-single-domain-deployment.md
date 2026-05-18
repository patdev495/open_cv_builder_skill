# 7. Docker Nginx Single-Domain Deployment

Date: 2026-05-18

## Status

Accepted

## Context

We need to deploy the CV Builder Pro application (comprising a React frontend, FastAPI backend, and SQLite database) onto a rented Linux VPS with a custom domain.
Deploying these services bare-metal introduces several complexities:
- Runtime overhead (manually configuring Python, Node.js, and Nginx versions on the host OS).
- Port and routing issues between the frontend dev/production build and the backend API port.
- CORS (Cross-Origin Resource Sharing) complications if served from separate domains.
- Data loss risks for the SQLite database (`cv_builder.db`) during git pulls or code redeployments.
- Manual SSL acquisition and renewal.

## Decision

We will adopt a containerized, single-domain deployment strategy utilizing Docker, Docker Compose, and Nginx as a reverse proxy:

1. **Single-Domain Reverse Proxy**: Nginx will act as the single entry point (`https://yourdomain.com`). It will serve the frontend's built static files directly and reverse-proxy any requests prefixing `/api` to the FastAPI backend container running on the internal bridge network.
2. **Environment Variable Configuration**: The frontend uses `import.meta.env.VITE_API_BASE_URL` with a fallback to `http://localhost:8000/api` for seamless local development, while in production it will build with a relative path `/api` to leverage Nginx routing.
3. **Database Volume Mapping**: The SQLite database file will be mapped using a Docker host volume to `/var/lib/cv-builder/` on the VPS host, making it completely immune to code updates or container restarts.
4. **SSL Certificates via Host Certbot**: We will obtain free SSL certificates using `certbot` installed directly on the host VPS system, and bind-mount the certificate directories into the Nginx container.

## Consequences

- **Positive**: Zero CORS complications, as both static frontend assets and backend endpoints reside on the same domain and port (443).
- **Positive**: Extremely simple maintenance. The entire multi-service system can be compiled, started, and stopped using standard `docker compose` commands.
- **Positive**: Complete host decoupling. The server host remains clean, requiring only Docker and Certbot installed.
- **Positive**: Safe data persistence. The database remains unaffected by code updates.
- **Negative**: The VPS must have at least 1GB of RAM to reliably run the Docker daemon and containers.
