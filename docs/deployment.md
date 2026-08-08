# Deployment

PortfolioCMS supports a host-development workflow and an all-container Docker Compose workflow.

## Local development

1. Copy `.env.example` to `.env.local` and replace every development secret.
2. Start dependencies with `docker compose up -d postgres storage storage-init`.
3. Install packages with `npm install`.
4. Verify PostgreSQL with `npm run db:check`.
5. Run the app with `npm run dev`.

The app is available at <http://localhost:3000>, MinIO's S3 endpoint at <http://localhost:9000>, and its local console at <http://localhost:9001>.

## Full Compose deployment

Set secure values for `POSTGRES_PASSWORD`, `AUTH_SECRET`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`, then run:

```bash
docker compose up --build -d
```

The app container reaches PostgreSQL at `postgres:5432` and object storage at `storage:9000`; these service DNS names are deliberate. The Compose defaults are for local development only. Put a TLS-terminating reverse proxy in front of the app for an internet-facing deployment.

## Health checks

`GET /api/health` verifies that the Next.js process can serve requests. PostgreSQL and storage have separate Compose health checks. A deeper dependency-aware readiness check can be added when application features depend on those services.
