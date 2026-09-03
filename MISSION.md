# Mission

**Derived from:** Product Specification for ContactsMe
**Last reconciled with it:** 2026-09-03

## What ContactsMe is

ContactsMe is a fast, reliable personal contact and address book manager tailored specifically for India. It is designed to help individuals save, categorize, search, and manage Indian contacts (+91 phone numbers) with zero friction. It provides an intuitive web interface for managing contact details—including normalized Indian mobile numbers, email addresses, physical addresses, tags, and rich notes—along with robust import/export capabilities (vCard and CSV).

The system is architected as a modern Next.js web application backed by PostgreSQL via Prisma ORM, engineered with clean RESTful API route boundaries so that client extensions (such as a future Chrome extension for quick contact capture or mobile companion apps for iOS and Android) can integrate seamlessly against the exact same backend service.

## Who it is for

- Individuals, freelancers, and professionals in India who need a fast, zero-bloat personal address book to keep track of people, phone numbers (+91), and context without being bogged down by complex enterprise CRM software.

ContactsMe is not a sales CRM, a bulk outreach tool, or a social network.

## Core capabilities (in scope)

The factory may accept issues in these areas:

**Contact Management**
- Create, view, update, and soft-delete contacts with structured fields (First Name, Last Name, Phone Numbers, Email Addresses, Postal Address, Company/Title, Notes).
- Indian phone number validation, parsing, and strict +91 normalization (e.g., standard 10-digit Indian mobile numbers formatted as `+91XXXXXXXXXX`).
- Contact search across names, phone numbers, email addresses, and notes with instant fuzzy matching.

**Organization and Tagging**
- Assign and manage multi-tag labels (e.g., "Work", "Family", "VIP", "Contractor") to segment contacts.
- Filter contacts by tag, company, or date added.
- Favorites / pinned contacts list for rapid access to frequent numbers.

**Data Portability & API**
- Export contacts to standard vCard (.vcf) and CSV formats.
- Import contacts from CSV or vCard with duplicate detection and preview before saving.
- Secure, versioned REST API routes (`/api/v1/contacts`) supporting full CRUD operations, designed to power future Chrome extension and mobile app clients.

**Storage & Reliability**
- PostgreSQL persistence managed through Prisma schema migrations.
- Healthcheck endpoint (`/api/health`) reporting database connectivity status.

## Out of scope -- the factory must never build this

1. Non-Indian international phone numbers (ContactsMe exclusively targets India +91 contact management).
2. Bulk SMS marketing, mass broadcasting, or automated cold phone dialing campaigns.
3. Cold email outreach sequencing, mass mailing campaigns, or newsletter tools.
4. Social networking feeds, friending mechanisms, or public user profile discovery.
5. Third-party scraping or automated contact enrichment from social networks without user initiation.
6. Calendar scheduling, meeting booking, or calendar sync integrations.
7. VoIP calling engine, softphone in-browser dialer, or call recording infrastructure.
8. Enterprise sales pipeline management, deal stages, lead scoring, or revenue forecasting.
9. Public searchable contact directories or peer-to-peer contact data exchange.

## Hard invariants -- not tunable by any issue

These are properties that define what ContactsMe is. The factory cannot modify them even if an issue asks nicely or calls it a bug:

1. **User contact data privacy and tenant isolation.** Contact records belong solely to the authenticated owner and must never be exposed or accessible across user boundaries.
2. **Indian phone number normalization and integrity (+91 only).** Phone numbers must strictly be valid Indian phone numbers normalized to the `+91` format (e.g., `+91XXXXXXXXXX`) upon storage. Numbers with non-Indian country codes or invalid formats must be rejected.
3. **No loss of contact data without explicit user confirmation.** Destructive operations (contact deletions or bulk imports that overwrite) must require explicit confirmation or support soft-deletion / trash recovery.
4. **The factory cannot modify governance files.** `MISSION.md`, `FACTORY_RULES.md`, and conventions files (`AGENTS.md`) are the constitution. A PR touching any of them is an automatic reject.
5. **The factory cannot modify its own judge.** `harness/`, `.factory/locks/`, and `.factory/holdout/` define what "working" means here. Adding an assertion is always welcome; removing or loosening one is a human decision, always.

## Allowed evolutions

Explicitly in scope, so the factory does not reject them as architectural drift:

- Optimizations in PostgreSQL indexing, full-text search indexing, and query performance.
- Progressive Web App (PWA) manifest and responsive layout enhancements for mobile browser access.
- Modularization of API route handlers to prepare for standalone client SDK consumption.

## Definition of done

Every change the factory ships clears all three gates:

**Gate 1 -- static checks and tests pass.** `npx tsc --noEmit` exits 0 with no type errors, and `npm test` passes all unit and integration test suites.

**Gate 2 -- user experience and data contract integrity.** Any new contact field or capability is intuitive, properly validated with schema checks (Zod / Prisma), and functional in the web UI without manual explanation.

**Gate 3 -- the end-to-end path passes as a real user.**
1. App is started via `npm run dev -- -p {port}`.
2. User creates an Indian contact with a `+91` phone number and tag.
3. User searches and finds the contact by the number and tag.
4. User updates the contact and verifies the changes persist across reloads.

## Open questions -- decisions nobody has made yet

These are undecided, not forbidden. The factory may propose an answer to any of them, build against it, and record what it assumed:

- **Q1 (Pagination vs Infinite Scroll):** Should the main contact list default to cursor-based pagination (e.g. 50 contacts per page) or an infinite scroll virtualized list?
- **Q2 (Duplicate Handling Strategy):** When importing contacts matching an existing phone number or email, should the default behavior prompt to merge, skip, or create a duplicate?

**Except these, which do stop the factory:**
- Changes to user authentication scheme, password hashing, or session token generation.
- Hard drop migrations of existing contact tables without data preservation and rollback scripts.

## What the factory does NOT own -- permanently human

- Visual brand identity, color theme choices, and aesthetic polish.
- Determining whether the UX feels effortless on real handheld mobile devices.
- Reviewing privacy policy and legal compliance regarding contact address book storage.

The factory owns the schema definitions, API routes, database queries, search indexing, and test harness. The aesthetic and product-feel layers are reviewed by a human.
