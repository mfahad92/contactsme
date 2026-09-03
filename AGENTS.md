# Developer & Agent Conventions for ContactsMe

## Product & Architecture
- **Product:** ContactsMe (Personal contact & address book manager for India)
- **Framework:** Next.js (App Router), TypeScript
- **Database / ORM:** PostgreSQL with Prisma ORM
- **API Convention:** Route Handlers in `app/api/v1/contacts/` with strict JSON validation (Zod)
- **E2E Driver:** HTTP (`npm run dev -- -p {port}` with health check at `/api/health`)

## Development Commands
- Start dev server: `npm run dev`
- Typecheck: `npx tsc --noEmit`
- Run tests: `npm test`
- Prisma generate: `npx prisma generate`
- Prisma migrate: `npx prisma migrate dev`

## Coding Standards
1. **Phone Numbers:** Strictly validate and normalize to Indian standard format (+91 followed by 10-digit mobile number, e.g. `+91XXXXXXXXXX`). Reject non-Indian numbers or invalid formats.
2. **Schema Validation:** Always parse and validate incoming payloads using Zod schemas matching Prisma models.
3. **Tenant & Data Isolation:** Always filter queries by authenticated user ownership.
4. **Governance:** Do not edit files under `MISSION.md`, `FACTORY_RULES.md`, `harness/`, or `.factory/` during regular feature or bug-fix tasks.
