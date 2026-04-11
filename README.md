# SecureMail Frontend

Next.js (App Router) web client for SecureMail: sign-in, mail experience, and integration with the SecureMail REST API.

## Tech stack

- **Next.js** 16 (React 19)
- **pnpm** (enforced via `preinstall`)
- **TanStack Query**, **Axios**, **Tailwind CSS**, **Zod**, etc.

## Ports

| Mode | Default URL |
|------|-------------|
| Dev (`pnpm dev`) | http://localhost:3000 (Next default; use if backend is elsewhere) |
| Docker Compose (repo root) | http://localhost:3001 (mapped to container port 3000) |

> In this monorepo, **backend** usually occupies **3000** locally; run the frontend on another port if needed: `pnpm dev -- -p 3001`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | **Public** REST base URL the browser calls (e.g. `http://localhost:3000`) |

Must be set at **build time** for production builds (baked into the client bundle).

## API documentation (for this team)

The REST contract is owned by **SecureMail-Backend**:

| Resource | URL (when backend runs locally) |
|----------|----------------------------------|
| Swagger UI | http://localhost:3000/api/docs |
| OpenAPI JSON | http://localhost:3000/api/docs-json |

Use `api/docs-json` with **openapi-typescript**, **orval**, or similar to generate typed clients aligned with the backend.

## Run locally (step-by-step)

1. Install **pnpm**.
2. From `SecureMail-Frontend`:
   ```bash
   pnpm install
   ```
3. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
4. Start dev server:
   ```bash
   pnpm dev
   ```
5. Open the URL printed in the terminal (adjust port if 3000 is taken by the API).

## Run with Docker

From **monorepo root**:

```bash
docker compose up --build frontend
```

Build arg `NEXT_PUBLIC_API_URL` defaults to `http://localhost:3000` (browser on the host calls the published backend port).

Full stack: see root [README.md](../README.md).

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| API calls fail / CORS | Backend `FRONTEND_URL` must match your site origin; `NEXT_PUBLIC_API_URL` must point to the API the **browser** can reach. |
| Wrong API in production | Rebuild image after changing `NEXT_PUBLIC_API_URL` (Next bakes public env at build time). |
| `only-allow pnpm` | Use `pnpm`, not `npm install`. |

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | ESLint |
