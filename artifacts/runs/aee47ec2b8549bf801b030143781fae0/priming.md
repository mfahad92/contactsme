# Node 1 · Prime

## What the issue touches

The issue implements the primary web user interface for ContactsMe, replacing the current minimal UI with a full-featured contact manager. It touches:

**Capability Area:** Contact Management (from MISSION.md) - specifically the "Organization and Tagging" and "Contact Management" sections.

**Files:**
- `app/page.tsx` - Main contact list page
- `components/` - Modular UI components to be created
- `app/api/v1/contacts/route.ts` - API used for fetching contacts (already exists)
- `lib/validation/contact.ts` - Validation schemas (already exist)

## Existing patterns to mirror

**API patterns:**
- `app/api/v1/contacts/route.ts:49-76` - Search with `q` and `tag` query params using Prisma's `findMany` with `include: { tags: true }`
- `lib/validation/contact.ts:3-25` - Zod schemas with strict Indian phone number validation `^/\+91\d{10}$/`

**Component patterns (if any existing):**
- Error handling: `try/catch` blocks returning `NextResponse.json({ error: "..." }, { status: 400/500 })`
- Phone validation: Consistent `+91XXXXXXXXXX` format in schema and display

**Test patterns:**
- `__tests__/api/contacts.test.ts:1-156` - Vitest tests with hoisted mocks
- `__tests__/api/contacts.test.ts:4-13` - Mock Prisma store pattern

**Naming conventions:**
- Components PascalCase: `ContactCard`, `SearchBar`, `TagFilter`
- Functions camelCase: `formatPhoneNumber`, `clearFilters`
- Files kebab-case for routes: `contacts/route.ts`

**State management patterns:**
- Query parameters for filtering: `?q=search&tag=tagName`
- Tags as array of strings connected via `connectOrCreate`

**Seams:**
- API already exists at `/api/v1/contacts` with GET support for search and tag filtering
- Validation schemas exist and must be used
- Prisma models already include `tags` relation

## How this project is checked

**Validation commands (from harness.config.json):**
- Static: `npx tsc --noEmit` (type checking)
- Unit: `npm test --silent` (Vitest tests)
- App-start: Healthcheck at `/api/health`
- E2E: Agent-driven journey validation via `harness/END-TO-END.md`
- Holdout: `.factory/holdout/HOLDOUT.md` (assertions builder cannot read)

**Gate requirements (FACTORY_RULES.md:105-120):**
1. Static checks pass (tsc --noEmit exits 0)
2. Unit tests pass with >0 tests run
3. App started (APP_STARTED marker)
4. E2E path passes with journey count ≥ ratchet floor
5. Holdout scenarios pass
6. Mutations catch all deliberate defects

**Current gate counts (from .factory/locks/floor.json:7-13):**
- `e2e_journeys`: 0
- `holdout_scenarios`: 0  
- `unit_tests`: 0

## Anything that looks already broken

**Existing issues distinct from this work:**
- `app/page.tsx` is currently minimal - only shows title and description, no contact UI
- No UI components exist in `components/` directory
- No search or filtering UI implemented
- No contact card/list view components

**Note:** These are the exact problems this issue solves. No pre-existing broken state needs fixing as part of this work.

## Report

This issue implements the web UI for ContactsMe's contact list with modern features. The core module already implemented is the API layer at `/api/v1/contacts` with search and tag filtering. The main files to touch are `app/page.tsx` and new `components/` directory. Critical care points are maintaining Indian phone number normalization `+91XXXXXXXXXX` format, implementing proper error handling matching existing patterns, and ensuring the UI seamlessly integrates with existing API endpoints. The validation harness will enforce type safety and functional correctness through the established gate system.