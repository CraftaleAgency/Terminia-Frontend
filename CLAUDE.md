# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
```

No test framework is configured. Package manager is **pnpm** (v9).

## Project Overview

**Terminia** is a B2B SaaS platform for Italian SMEs to manage contracts, invoices, counterparts, employees, and public tenders (bandi). The stack is **Next.js 16 App Router + TypeScript + Supabase (PostgreSQL + Auth)** with a **NemoClaw** AI backend for contract analysis, OSINT verification, OCR, and chat.

All UI text is in **Italian**.

## Architecture

### Data Flow

```
Server Components / Client Components
  → Server Actions (lib/actions/)     ← AI calls go through here
  → lib/data.ts                        ← Supabase queries go through here
  → Supabase client (lib/supabase/)    → PostgreSQL (RLS enforced)
```

- **`lib/data.ts`** is the single data-access layer for all Supabase queries. Do not scatter direct Supabase calls in components.
- **`lib/actions/`** contains server actions that wrap the NemoClaw AI API: `contracts.ts`, `chat.ts`, `osint.ts`, `ocr.ts`.
- **`lib/ai/client.ts`** is the NemoClaw API client (base URL via `NEMOCLAW_API_URL` env var, defaults to `https://nemoclaw.pezserv.org`).

### Key Directories

| Path | Purpose |
|------|---------|
| `app/auth/` | Login, register pages + `actions.ts` (server actions) |
| `app/dashboard/` | Protected app pages (bandi, contracts, counterparts, invoices, documents) |
| `app/onboarding/` | Post-signup company setup |
| `app/docs/` | Public documentation site |
| `components/ui/` | ~90 shadcn/ui components — **do not edit manually** |
| `components/dashboard/` | Sidebar, header, AI chat sidebar |
| `components/landing/` | Marketing page sections |
| `lib/data.ts` | All Supabase query functions |
| `lib/mock-data.ts` | All shared TypeScript types, enums, and formatters |
| `lib/actions/` | Server actions wrapping NemoClaw AI endpoints |
| `lib/ai/client.ts` | NemoClaw API client with typed request/response |
| `types/database.ts` | Auto-generated Supabase database types |
| `supabase/migrations/` | SQL migration files |

### Authentication & Multi-Tenancy

- Supabase Auth (email/password). Server actions in `app/auth/actions.ts`.
- Every `users` row has a `company_id`. All tables use RLS with `auth_company_id()` for company-level isolation.
- Use **server client** (`lib/supabase/server.ts`) in Server Components and server actions.
- Use **browser client** (`lib/supabase/client.ts`) in `'use client'` components.

### Account Types

Users are `"company"` or `"person"`. The sidebar (`components/dashboard/sidebar.tsx`) renders different nav items per type:
- **company**: Contracts, Counterparts, Employees, Invoices, BandoRadar, Analytics, Alerts, Documents
- **person**: My Contracts, Alerts, AI Analysis, Documents

## Conventions

### Styling

- Use `cn()` from `@/lib/utils` for all className composition — never concatenate strings.
- Tailwind CSS v4 with CSS-first config (no `tailwind.config.*`). Theme variables are OKLCH colors in `app/globals.css`.
- Dark mode via `next-themes` with `.dark` class.

### Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Never hand-edit files in `components/ui/`.

### Type Definitions

All shared types and enums live in `lib/mock-data.ts`. Use union types for status fields:

```typescript
export type ContractStatus = "draft" | "negotiating" | "active" | "expiring"
```

Auto-generated Supabase types are in `types/database.ts` (helpers: `Tables<>`, `TablesInsert<>`, `TablesUpdate<>`).

### Icons

Use **Lucide React** exclusively. Import by name: `import { FileText } from "lucide-react"`.

### Forms

React Hook Form + Zod. Validation schemas with `z.object(...)`, resolved via `@hookform/resolvers/zod`.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEMOCLAW_API_URL=          # Optional, defaults to https://nemoclaw.pezserv.org
```

Never add service-role keys to `NEXT_PUBLIC_` variables.

## Caveats

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`. Fix type errors in new code rather than relying on this.
- Images are unoptimized (`images.unoptimized: true`).
