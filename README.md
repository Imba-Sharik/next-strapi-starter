# next-strapi-starter

Production-ready monorepo starter with **Next.js 15 App Router**, **Auth.js v5**, **Strapi 5**, **Kubb** type generation, and **shadcn/ui**.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) |
| Auth | Auth.js v5 (NextAuth) — Credentials Provider → Strapi |
| Backend / CMS | Strapi 5 |
| API types | Kubb 4 (generates typed clients from OpenAPI) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Package manager | npm workspaces |
| DB (local) | SQLite |
| DB (prod) | PostgreSQL (Railway) |

## What's included

- Login + Register pages wired to Strapi `/api/auth/local`
- Auth.js session stores the Strapi JWT (encrypted cookie)
- Fixed header with auth-aware user navigation
- Kubb code generation: typed axios clients auto-generated from Strapi OpenAPI schema
- FSD (Feature-Sliced Design) folder structure in frontend
- Strapi `users-permissions` + `documentation` plugins enabled
- Deploy-ready: Vercel (frontend) + Railway (backend)

## Project structure

```
next-strapi-starter/
├── apps/
│   ├── frontend/          # Next.js — Vercel
│   └── backend/           # Strapi 5 — Railway
├── package.json           # npm workspaces root
└── .gitignore
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/next-strapi-starter.git
cd next-strapi-starter
```

Or use as a GitHub template — click **"Use this template"** at the top of the repo.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

**Backend** (`apps/backend/.env`):

```bash
cp apps/backend/.env.example apps/backend/.env
```

Generate secrets and fill in the values:

```bash
# Generate APP_KEYS (4 random base64 strings, comma-separated)
node -e "const c=require('crypto');console.log([1,2,3,4].map(()=>c.randomBytes(16).toString('base64')).join(','))"

# Other secrets — generate individually
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

**Frontend** (`apps/frontend/.env.local`):

```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

Generate `AUTH_SECRET`:

```bash
npx auth secret
```

### 4. Run locally

```bash
# Terminal 1 — Strapi backend (http://localhost:1337)
npm run backend

# Terminal 2 — Next.js frontend (http://localhost:3000)
npm run frontend
```

On first Strapi launch, create an admin account at http://localhost:1337/admin.

## Kubb — API type generation

When you add a new content type in Strapi:

```bash
# 1. Start Strapi (updates OpenAPI schema automatically)
npm run backend

# 2. Generate typed clients
cd apps/frontend && npm run generate
```

New types and axios clients appear in `src/shared/api/generated/`.

Use generated clients with `strapiConfig(token?)` in application code.
In `auth.ts` use raw `fetch` (Edge Runtime compatibility) + Kubb types.

## Deploy

### Frontend → Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `apps/frontend`
4. Add environment variables:
   - `AUTH_SECRET` — same as local
   - `STRAPI_URL` — your Railway backend URL

### Backend → Railway

1. Create a new project on [railway.app](https://railway.app)
2. Connect GitHub repo, set **Root Directory** to `apps/backend`
3. Add environment variables from `apps/backend/.env.example`
4. Add a **PostgreSQL** service and set:
   ```
   DATABASE_CLIENT=postgres
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DATABASE_SSL=true
   ```

## Architecture decisions

- `apps/frontend/src/shared/api/strapi.ts` — single place with backend URL (`STRAPI_URL`). Change only here when migrating.
- Auth.js Credentials Provider calls Strapi `/api/auth/local`, stores the JWT in the session.
- Strapi JWT is forwarded as `Authorization: Bearer <token>` in API requests.

## License

MIT
