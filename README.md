# Finance Dashboard UI

A modern, responsive **finance dashboard** built with **Vite**, **React 19**, and **TypeScript**. It presents balances and trends from mock (or persisted) transactions, a full ledger table, and an insights view—wrapped in a dark, glassy shell with teal accent navigation.

## Overview

The app is a single-page experience with three routes under a shared layout:

| Route | Purpose |
|-------|---------|
| **`/`** | Overview: KPI cards, balance trend and category expense charts, embedded transactions table |
| **`/transactions`** | Dedicated ledger page with search, filters, and export |
| **`/insights`** | Derived metrics (spending leader, net savings, cash flow) and monthly income vs expense chart |

**State** lives in **Zustand** with **persist** middleware: your transaction list and selected **role** survive reloads (see [Persistence](#persistence)). Charts and totals read from the same store so numbers stay consistent everywhere.

**UI** uses **Tailwind CSS v4**, **lucide-react** icons, **Framer Motion** for light motion, and **Recharts** for analytics visuals.

---

## Features

### Layout & navigation

- **App shell** (`AppShell`): gradient background, sticky top bar, and desktop **sidebar** (`NewSidebar`) with Overview / Transactions / Insights.
- **Top bar**: role switcher (**Admin** / **Viewer**), notifications placeholder (bell), profile placeholder (initials).
- **Mobile**: compact nav chips for the three sections.

### Transactions & roles

- **Viewer**: can browse the ledger and use search/filter/sort/export; cannot add or delete.
- **Admin**: can **add** transactions via modal validation and **delete** rows from the table.
- The Zustand store also exposes **`editTransaction`** for future or custom UI; the current table shows an edit affordance but does not open an edit flow by default.

### Transactions table

- **Search** across date, amount, category, type, and id.
- **Filter** by flow: all / income / expense.
- **Sort** by date (ascending “Oldest” or descending “Newest”).
- **Export** visible rows as **CSV** with a timestamped filename.
- Loading and empty states; category icons; income/expense styling.

### Dashboard (home)

- **Cards**: total balance, total income, total expenses (computed in one pass over transactions).
- **Balance trend** (Recharts): cumulative balance over time; supports expense context in chart data where implemented.
- **Category-wise expenses**: pie-style breakdown; top categories plus “Other” when needed.
- **Empty state** with CTA when there are no transactions.

### Insights

- **Highest spending category**, **net savings** and **savings rate**, **monthly cash flow** summary.
- **Monthly income vs expenses** bar chart (recent months).

### Data & types

- Seed data and types live in **`src/data/transactions.ts`** (`Transaction`, `TransactionCategory`, `TransactionType`).
- App display name: **`Finance Dashboard UI`** (`src/data/index.ts` → `appName`).

---

## Tech stack

| Area | Choice |
|------|--------|
| Build | Vite 8 |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), `darkMode: 'class'` |
| Routing | `react-router-dom` 7 |
| State | Zustand 5 + `persist` |
| Charts | Recharts 3 |
| Motion | Framer Motion |
| Icons | lucide-react |
| Class helpers | `clsx`, `tailwind-merge` (`src/utils/cn.ts`) |

---

## Setup instructions

### Prerequisites

- **Node.js** 18+ (20+ recommended) and **npm**.

### Install

```bash
cd dashboard_ui
npm install
```

### Development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Production build

```bash
npm run build
```

Output is in `dist/`. Preview locally:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project structure

```
dashboard_ui/
├── index.html
├── vite.config.ts          # React + Tailwind plugins; `@` → src/
├── tailwind.config.js      # darkMode: class; content paths
├── package.json
└── src/
    ├── main.tsx            # BrowserRouter + root render
    ├── App.tsx             # Routes: /, /transactions, /insights
    ├── index.css           # Tailwind + design tokens (--app-* utilities)
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx    # Shell, navbar, Outlet
    │   │   └── NewSidebar.tsx  # Desktop sidebar
    │   ├── charts/             # Recharts wrappers
    │   └── transactions/       # Table + AddTransactionModal
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── TransactionsPage.tsx
    │   └── InsightsPage.tsx
    ├── store/
    │   └── useDashboardStore.ts
    ├── data/
    │   ├── index.ts            # appName, re-exports
    │   └── transactions.ts     # types + seed `transactions[]`
    ├── hooks/
    └── utils/
        └── cn.ts
```

---

## Architecture & approach

### Single source of truth

`useDashboardStore` holds:

- **`transactions`** – full ledger (persisted).
- **`filters`** – type, category, query, optional date range; drives **`filteredTransactions`** when you call **`filterTransactions`**. (The main ledger UI uses **local** search/filter/sort so the dashboard charts always see the full dataset.)
- **`role`** – `Admin` | `Viewer` (persisted).
- **`theme`** – typed in store as dark for persistence compatibility; the root layout applies the **`dark`** class for Tailwind `dark:` variants.

### Persistence

- **Storage key**: `dashboard_ui_store` (see `persist` config in `useDashboardStore.ts`).
- **Persisted slices**: `transactions`, `role` (and theme field aligned to dark in `partialize` / rehydrate).
- **After rehydrate**: `filterTransactions({})` recomputes `filteredTransactions` so derived state matches saved filters.

### Routing & composition

`App.tsx` nests all pages inside `<AppShell />`, which renders `<Outlet />` for the active route. Pages are presentational: they pull from the store and pass data into chart/table components.

### Analytics

All KPIs and chart series are **derived with `useMemo`** from `transactions` (no duplicate sources of truth). This keeps overview, insights, and exports aligned when data changes.

---

## Customization

- **Seed data**: edit `src/data/transactions.ts`.
- **Branding**: change `appName` in `src/data/index.ts` and sidebar copy in `NewSidebar.tsx`.
- **Persisted name / versioning**: adjust `name` and `version` in the Zustand `persist` options if you need a clean break from old localStorage shapes.

---

## License

Private project (`"private": true` in `package.json`). Adjust as needed for your use case.
