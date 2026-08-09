# HostelFix — Hostel Complaint Management System

HostelFix is a web application that lets hostel residents report issues and lets wardens track
every complaint from report to resolution. It replaces paper registers and scattered chat messages
with one shared, searchable record.

## Features

- **Dashboard** — totals for Open, In Progress and Resolved complaints, a status distribution bar,
  and the five most recent complaints.
- **Submit a complaint** — validated form covering title, category, location, description and
  optional priority.
- **Complaints list** — full-text search plus filters for status, category and location, with
  newest/oldest sorting. Responsive table on desktop, cards on mobile.
- **Complaint details** — full description, metadata, a visual status timeline, inline editing and
  one-click status updates.
- **About** — plain-language explanation of the complaint lifecycle.
- Loading, empty and error states on every data-driven view, with accessible labels throughout.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start (React 19, SSR) |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Validation | Zod |
| Backend | Lovable Cloud (PostgreSQL + auto-generated API) |
| Notifications | Sonner |

## Database schema

A single `complaints` table:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, auto-generated |
| `title` | `text` | Short summary of the issue |
| `category` | `text` | Maintenance, Electrical, Plumbing, Mess, Cleaning, Internet, Furniture, Other |
| `location` | `text` | Block / room / area |
| `description` | `text` | Full description |
| `priority` | `text` | Low, Medium, High (defaults to Medium) |
| `status` | `text` | Open, In Progress, Resolved (defaults to Open) |
| `created_at` | `timestamptz` | Set on insert |
| `updated_at` | `timestamptz` | Maintained by a trigger on update |

Row Level Security is enabled. This build is intentionally open — anyone can read, create and
update complaints — so residents can file issues without an account. Add authentication and
owner-scoped policies before using it with real, sensitive data.

## Project structure

```text
src/
  components/
    common/       Empty, loading and error states
    complaints/   Badges, table, card, form, filter bar, status timeline
    dashboard/    Stat card
    layout/       AppShell (sidebar + mobile navigation)
    ui/           shadcn/ui primitives
  hooks/
    use-complaints.ts     TanStack Query hooks (list, detail, create, update)
  lib/
    complaints.ts         Database access layer
    format.ts             Date, relative-time and greeting helpers
  routes/
    __root.tsx            Root shell, head metadata, providers
    index.tsx             Dashboard          (/)
    submit.tsx            Submit complaint   (/submit)
    complaints.index.tsx  Complaint list     (/complaints)
    complaints.$id.tsx    Complaint detail   (/complaints/:id)
    about.tsx             About              (/about)
  types/
    complaint.ts          Domain types and constants
```

## Data flow

Route components call hooks in `src/hooks/use-complaints.ts`, which wrap the functions in
`src/lib/complaints.ts`. Those talk to the database through the generated client. Mutations update
the detail cache directly and invalidate the list query, so the dashboard and list stay in sync
immediately after a create or status change.

## Accessibility

Semantic landmarks and headings, one `h1` per page, labelled form fields with `aria-invalid` and
inline error messages, `aria-live` regions for loading and result counts, visible focus rings, and
colour is never the only status indicator.

---

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
