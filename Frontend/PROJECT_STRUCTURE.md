# PropertyOS — Frontend

> A commercial real estate property management and CRM platform for the Indian market.

## Purpose

PropertyOS is a full-featured property management system that handles:
- **Property inventory** — buildings, floors, units with commercial terms
- **CRM** — clients, requirements, deals, and proposals
- **Operations** — tasks, site visits, follow-ups, approvals
- **Analytics** — reports, dashboards, data imports/exports

Built for Indian commercial real estate brokers and property managers.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19, shadcn/ui (base-nova), Tailwind CSS v4 |
| State | TanStack React Query v5 |
| Forms | React Hook Form + Zod v4 |
| Auth | NextAuth v5 (beta) |
| Charts | Recharts v3 |
| Icons | Lucide React |

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth route group
│   │   │   ├── login/page.tsx         # /login
│   │   │   ├── verify-otp/page.tsx    # /verify-otp
│   │   │   └── forgot-password/page.tsx # /forgot-password
│   │   │
│   │   ├── (dashboard)/               # Property management route group
│   │   │   ├── dashboard/page.tsx     # /dashboard
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx           # /properties (list)
│   │   │   │   ├── new/page.tsx       # /properties/new (8-step form)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # /properties/:id (detail)
│   │   │   │       └── edit/page.tsx  # /properties/:id/edit
│   │   │   ├── units/page.tsx         # /units
│   │   │   ├── approvals/page.tsx     # /approvals
│   │   │   ├── media/page.tsx         # /media
│   │   │   ├── activity/page.tsx      # /activity
│   │   │   └── settings/page.tsx      # /settings
│   │   │
│   │   ├── (v2)/                      # CRM route group
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx           # /clients (list)
│   │   │   │   ├── new/page.tsx       # /clients/new
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # /clients/:id (detail)
│   │   │   │       └── edit/page.tsx  # /clients/:id/edit
│   │   │   ├── deals/page.tsx         # /deals (pipeline view)
│   │   │   ├── tasks/page.tsx         # /tasks
│   │   │   ├── follow-ups/page.tsx    # /follow-ups
│   │   │   ├── site-visits/page.tsx   # /site-visits
│   │   │   ├── proposals/page.tsx     # /proposals
│   │   │   ├── requirements/page.tsx  # /requirements
│   │   │   ├── reports/page.tsx       # /reports (charts)
│   │   │   ├── imports/page.tsx       # /imports
│   │   │   ├── exports/page.tsx       # /exports
│   │   │   └── map/page.tsx           # /map
│   │   │
│   │   └── api/auth/                  # API routes
│   │       ├── [...nextauth]/route.ts # NextAuth handler
│   │       ├── send-otp/route.ts      # OTP send (mock)
│   │       ├── verify-otp/route.ts    # OTP verify (mock)
│   │       └── forgot-password/route.ts # Password reset (mock)
│   │
│   ├── components/
│   │   ├── auth/                      # Login, OTP, ForgotPassword forms
│   │   ├── layout/                    # Sidebar, TopBar (with search + notifications)
│   │   ├── properties/                # InfoSection, ContactCard, MediaGallery
│   │   ├── shared/                    # PageHeader, MultiStepForm, StatusBadge, etc.
│   │   └── ui/                        # 27 shadcn/ui components
│   │
│   ├── hooks/                         # 11 data hooks (React Query + mock fallback)
│   ├── lib/
│   │   ├── api/client.ts              # REST API client
│   │   ├── auth.ts                    # NextAuth config
│   │   ├── constants.ts               # Labels, colors, nav items
│   │   └── utils.ts                   # cn() and helpers
│   ├── providers/                     # Auth, Query, Data providers
│   ├── types/index.ts                 # All TypeScript types
│   └── middleware.ts                   # Route protection
│
├── public/                            # Static assets
├── .env.local.example                 # Environment variable template
├── package.json
├── tsconfig.json
├── components.json                    # shadcn/ui config
├── eslint.config.mjs
└── postcss.config.mjs
```

---

## What Has Been Implemented

### Authentication (Complete)
- Login with email/password (NextAuth v5)
- OTP verification flow (6-digit code with auto-advance, paste, resend)
- Forgot password flow
- Route protection middleware (cookie-based)
- Auth API routes (mock — accept any credentials)

### Dashboard
- Stat cards (total properties, available, pending approvals, worker performance)
- Pending approvals list
- Recent activity feed
- Quick-action buttons

### Properties (Full CRUD)
- **List page** — search, filter (state/city/type/furnishing/status/area/rent), pagination, sort, checkbox selection
- **Detail page** — stats, location, commercial terms, availability, record info, estimated rent calculation
- **Edit page** — pre-populated 8-step form
- **New page** — 8-step multi-step form with:
  - Steps 1-4: real form fields with state management
  - Step 5: dynamic contacts (add/remove, type, primary toggle)
  - Step 6: media files (add by category, remove)
  - Step 7: notes
  - Step 8: full review summary

### Approvals
- List with status/priority filters
- Stat cards (pending, high priority, approved today, rejected)
- Field-level diff display

### V1 Support Pages
- **Units** — filtered property list (unit entry type)
- **Media** — gallery with category grouping and stats
- **Activity** — audit trail with user actions and field changes
- **Settings** — profile, notifications, security sections

### V2 CRM Modules
- **Clients** — list, detail, create, edit (full CRUD)
- **Requirements** — client property requirements (lease/buy/sell) with location, area, budget
- **Deals** — pipeline view (Kanban-style by stage) + list view, stats (active deals, pipeline value, conversion)
- **Tasks** — status-based list with priority badges, inline status change
- **Site Visits** — scheduled visits with status, date/time, location
- **Proposals** — lease proposals with status pipeline (draft→sent→accepted/rejected)
- **Follow-ups** — tracking with type icons, overdue highlighting, complete/skip actions
- **Reports** — charts (properties by city, deals by stage, availability, rent distribution)
- **Imports** — CSV/Excel upload UI with import history
- **Exports** — multi-select data types with format toggle
- **Map** — placeholder with simulated pins and property sidebar

### TopBar
- ⌘K search dialog (searches properties, clients, deals, pages)
- Notification dropdown with unread badges and mark-all-read
- User avatar menu with profile, settings, logout

---

## Backend Work

All API routes are **mock implementations**:
- `send-otp` — logs to console, returns success
- `verify-otp` — accepts any 6-digit code, sets mock cookie
- `forgot-password` — logs to console, returns success
- `authorize` — accepts any email/password, returns hardcoded admin user

The API client (`lib/api/client.ts`) is configured to call `http://localhost:8000/api` but falls back to mock data in all hooks.

---

## Database / Schema / Model Work

No database is connected. All types are defined in `src/types/index.ts`:
- `Property`, `Building`, `Floor`, `Unit` — property hierarchy
- `Contact`, `MediaDocument` — related entities
- `ChangeRequest`, `FieldChange` — approval workflow
- `Client`, `Requirement`, `Deal`, `Task`, `SiteVisit` — CRM entities
- `ActivityLog` — audit trail
- `FilterParams`, `PaginatedResponse`, `ApiResponse` — API types

---

## Environment Variables

See `.env.local.example` — no secrets are committed:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:8000/api`) |
| `AUTH_SECRET` | NextAuth secret |
| `AUTH_URL` | App URL (default: `http://localhost:3000`) |
| `SMTP_HOST/PORT/USER/PASS` | Email service for OTP |
| `EMAIL_FROM` | Sender address |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps for map view |
| `NEXT_PUBLIC_UPLOAD_BUCKET_URL` | File upload bucket |
| `UPLOAD_ACCESS_KEY/SECRET_KEY` | Upload credentials |

---

## Setup & Run

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## Known Issues & Missing Pieces

### Incomplete
- `/buildings` and `/floors` routes are empty placeholders
- `/reset-password` and `/mobile-recovery` auth routes are empty
- New Property form steps 5-6 (contacts/media) work but don't persist to backend
- Map view is a placeholder — needs Google Maps or Mapbox integration
- Imports/Exports are UI-only — no actual file processing

### Not Started
- Real backend integration (all hooks fall back to mock data)
- Real auth (currently accepts any credentials)
- File upload functionality
- Email OTP delivery
- Role-based access control (admin vs worker)
- Real-time notifications
- WebSocket or SSE for live updates

### Technical Debt
- 22 ESLint warnings (unused imports, missing hook dependencies)
- Empty component directories (`approvals/`, `dashboard/`, `media/`)
- Empty mock directories (`lib/mock/data/`, `lib/mock/handlers/`)
- Legacy route stubs in `src/app/login/`, `src/app/verify-otp/` etc.

---

## Suggested Next Development Plan

### Priority 1: Backend Integration
1. Set up the backend API (Node.js/Express or similar)
2. Implement real auth endpoints
3. Replace mock hooks with real API calls
4. Add proper error handling and loading states

### Priority 2: Core Feature Completion
1. Buildings/Floors management pages
2. File upload for property media
3. Real Google Maps integration
4. Email OTP delivery

### Priority 3: Advanced Features
1. Real-time notifications (WebSocket)
2. Role-based access control
3. Bulk operations (import/export with real processing)
4. Advanced reporting and analytics

### Priority 4: Polish
1. Fix ESLint warnings
2. Add error boundaries
3. Improve loading states
4. Mobile responsiveness testing

---

## Technical Decisions

- **Route Groups**: `(dashboard)` and `(v2)` separate property management from CRM features, allowing independent layouts
- **Mock-first approach**: All data hooks try the real API first, fall back to mock data — enables frontend development without backend
- **shadcn/ui base-nova**: Uses the newest shadcn style with `@base-ui/react` primitives (not Radix)
- **Multi-step form**: Custom `MultiStepForm` component with context-based step management
- **Centralized types**: All TypeScript types in `src/types/index.ts` for easy reference
- **Constants-driven**: Labels, colors, and nav items in `lib/constants.ts` — easy to maintain
