# Copilot Instructions – Terminia Frontend

## Commands

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Production build
pnpm lint       # ESLint
```

No test framework is configured in this repository.

## Architecture

**Terminia** is a B2B SaaS platform for Italian SMEs to manage contracts, invoices, counterparts, employees, and public tenders. The stack is **Next.js App Router + TypeScript + Supabase (PostgreSQL + Auth)**.

### App structure

```
app/                  # Next.js App Router
  auth/               # Login / register pages + server actions
  dashboard/          # Protected app (18 pages)
  onboarding/         # Post-signup setup
  page.tsx            # Marketing landing page
components/
  ui/                 # ~90 shadcn/ui components (do not edit manually)
  dashboard/          # Sidebar + header layout components
  landing/            # Marketing page sections
lib/
  data.ts             # All Supabase queries (single data-access layer)
  mock-data.ts        # All TypeScript type definitions
  supabase/
    client.ts         # Browser Supabase client
    server.ts         # SSR Supabase client (uses cookies)
  utils.ts            # cn() helper (clsx + tailwind-merge)
supabase/migrations/  # SQL migration files
```

### Data flow

Components → custom hooks → `lib/data.ts` → Supabase client → PostgreSQL (RLS enforced)

All database queries live in `lib/data.ts`. Don't scatter direct Supabase calls across components; add new queries there.

### Authentication & multi-tenancy

- Auth is handled via Supabase Auth (email/password).
- Server actions for login/signup are in `app/auth/actions.ts` (`'use server'`).
- Every `users` row has a `company_id`. All tables use RLS with a `auth_company_id()` helper to enforce company-level isolation automatically.
- Use the **server** client (`lib/supabase/server.ts`) in Server Components and server actions; use the **browser** client (`lib/supabase/client.ts`) in `'use client'` components.

### Account types & role-based navigation

Users are either `"company"` or `"person"`. The sidebar (`components/dashboard/sidebar.tsx`) renders different nav items depending on the type:
- **company**: Contracts, Counterparts, Employees, Invoices, BandoRadar, Analytics, Alerts, Documents
- **person**: My Contracts, Alerts, AI Analysis, Documents

## Key conventions

### Styling

Use the `cn()` utility from `@/lib/utils` for all `className` composition—never concatenate strings directly.

```typescript
import { cn } from "@/lib/utils"
<div className={cn("base-class", condition && "conditional-class")} />
```

Tailwind CSS v4 with CSS custom properties. Colors use OKLCH; theme variables are defined in `app/globals.css`. Dark mode is controlled by the `.dark` class via `next-themes`.

### Adding shadcn/ui components

Use the CLI; do **not** copy-paste or hand-edit files in `components/ui/`:

```bash
pnpm dlx shadcn@latest add <component-name>
```

### Type definitions

All shared types and interfaces live in `lib/mock-data.ts`. Add new types there, not inline in component files. Union types are used for status fields:

```typescript
export type ContractStatus = "draft" | "negotiating" | "active" | "expiring"
```

### Icons

Use **Lucide React** exclusively. Import icons by name:

```typescript
import { FileText, AlertCircle } from "lucide-react"
```

### Forms

Use **React Hook Form** + **Zod** for all forms. Validation schemas defined with `z.object(...)`, resolved with `@hookform/resolvers/zod`.

### Language

All UI-facing text is in **Italian**. Keep new user-visible strings in Italian.

### Environment variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Both are public (browser-safe). Never add service-role keys to `NEXT_PUBLIC_` variables.

### TypeScript

`next.config.mjs` sets `typescript.ignoreBuildErrors: true`. Fix type errors rather than relying on this escape hatch when adding new code.
