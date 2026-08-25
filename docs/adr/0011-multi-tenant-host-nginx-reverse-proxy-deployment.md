# 11. Multi-Tenant VPS Deployment with Host Nginx Reverse Proxy

Date: 2026-08-25

## Status

Accepted

## Context

The CV Builder application needs to be deployed to a production Linux VPS (`107.175.144.245`) under the subdomain `cvbuilder.peebot.shop`.
Inspection of the VPS revealed:
1. An existing application (`auto-affiliate`) is already running in Docker containers, binding ports `8020` and `6080`.
2. Host Nginx is actively running on systemd and listening on ports `80` and `443`.
3. A valid wildcard SSL certificate (`*.peebot.shop`) issued by Let's Encrypt / acme.sh is already active on the host at `/etc/letsencrypt/live/peebot.shop/`.
4. Direct binding of Docker Nginx to ports `80:80` and `443:443` would cause immediate port conflict errors with host Nginx and disrupt existing services.

## Decision

We adopt a two-tier reverse proxy architecture:

1. **Host Nginx Tier (L7 Router & SSL Termination)**:
   - Host Nginx continues to bind `0.0.0.0:80` and `0.0.0.0:443`.
   - A dedicated server block `/etc/nginx/conf.d/cvbuilder.peebot.shop.conf` is configured for `server_name cvbuilder.peebot.shop`.
   - Host Nginx terminates SSL using the existing wildcard certificate `/etc/letsencrypt/live/peebot.shop/fullchain.pem`.
   - Host Nginx proxies all traffic to `http://127.0.0.1:8030`.

2. **Container Tier (Application & API Layer)**:
   - The CV Builder Docker Compose stack runs independently in `/opt/cv-builder`.
   - `cv-builder-frontend` binds internal port `127.0.0.1:8030:80`.
   - `cv-builder-frontend` serves static assets and routes `/api` to the internal `cv-builder-backend:8000` service.
   - SQLite database is persisted to host path `/var/lib/cv-builder/`.

## Consequences

- **Positive**: Zero port conflicts or interference with existing services running on the VPS.
- **Positive**: Leverages existing valid wildcard SSL certificate without needing new ACME challenges or cert issuance downtime.
- **Positive**: Total isolation of CV Builder application containers and database.
- **Positive**: Clean modular separation with independent git pulls and docker rebuilds.
