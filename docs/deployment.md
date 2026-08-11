# Deployment

PortfolioCMS supports a host-development workflow and an all-container Docker Compose workflow.

## Local development

1. Copy `.env.example` to `.env.local` and replace every development secret.
2. Start dependencies with `docker compose up -d postgres storage storage-init`.
3. Install packages with `npm install`.
4. Apply migrations with `npm run db:migrate`.
5. Verify PostgreSQL with `npm run db:check`.
6. Run the app with `npm run dev` and complete `/setup` once.

The app is available at <http://localhost:3000>, MinIO's S3 endpoint at <http://localhost:9000>, and its local console at <http://localhost:9001>.

`storage-init` creates the configured bucket idempotently. The bucket stays private: browsers receive media through the application's `/media/[id]` route, so no anonymous MinIO/S3 policy is required. For an external provider, create `S3_BUCKET` before application startup and grant the configured server credentials object read, write, and delete access for that bucket.

For browser tests, `TEST_DATABASE_URL` may point to a dedicated database whose name ends in `_test`. Never point it at a production or development database: the Playwright bootstrap truncates its authentication tables.

## Full Compose deployment

Set secure values for `POSTGRES_PASSWORD`, `AUTH_SECRET`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`, then run:

```bash
docker compose up --build -d
```

The app container reaches PostgreSQL at `postgres:5432` and object storage at `storage:9000`; these service DNS names are deliberate. The Compose defaults are for local development only. Put a TLS-terminating reverse proxy in front of the app for an internet-facing deployment.

Compose runs the checked-in migrations through its one-shot `migrate` service before the app starts. For deployments that do not use Compose, run `npm run db:migrate` as a release step before serving a new application version. Use a unique, random `AUTH_SECRET` of at least 32 characters and keep `APP_URL` equal to the externally visible origin so secure cookie and origin checks behave correctly.

`MAX_UPLOAD_SIZE_MB` controls the server-side file limit. Keep the reverse proxy's request-body limit at or above this value plus normal multipart overhead. Supported uploads are JPEG, PNG, WebP, GIF, and PDF; SVG is deliberately unsupported.

## Health checks

`GET /api/health` verifies that the Next.js process can serve requests. PostgreSQL and storage have separate Compose health checks. A deeper dependency-aware readiness check can be added when application features depend on those services.
