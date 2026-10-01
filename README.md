# Expense Dashboard

A web application for **tracking and analyzing personal expenses**. Record your
spending, organize it by category, and follow your financial trends through
indicators and charts that update in real time.

The project also serves as a study reference for current **Angular 22**
practices: standalone components, Signals, the new template control flow,
Typed Reactive Forms, and lazy loading.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-22-757575?logo=materialdesign&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)

> The user interface is in Brazilian Portuguese (pt-BR), with amounts in BRL
> and dates in `dd/MM/yyyy` format.

---

## Features

### Expense management
- Create, edit, and delete expenses.
- Each expense has a description, category, amount, date, and type (**fixed** or **variable**).
- Categories: Food, Transportation, Housing, Health, Education, Leisure, and Other.
- Form validation: required fields and an amount greater than zero.

### List and filters
- A table with every recorded expense.
- Search by description (case- and accent-insensitive).
- Filter by category.
- Filter by date range (start and end date).
- Filters can be combined and are applied instantly.

### Dashboard
Indicators that update automatically whenever an expense changes:

| Indicator | Description |
|---|---|
| Total spent | Sum of all expenses |
| Count | Number of recorded expenses |
| Largest expense | The expense with the highest amount |
| Average | Average amount per expense |

### Charts
- **Doughnut:** share of spending by category.
- **Bar:** total spent per category.
- **Line:** spending over time, month by month.

### Persistence
- Data is stored in the browser's **localStorage**. No backend is required.
- On first launch, the app is seeded with 25 sample expenses
  (April to September 2026, covering every category).
- The list filters are also remembered across sessions.
- The persistence layer is abstracted, so localStorage can be replaced with a
  REST API without changing components or state.

> To restore the sample data, delete the `expense-dashboard:expenses` key in
> DevTools → Application → Local Storage and reload the page.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Angular 22 (standalone, zoneless) |
| Language | TypeScript 6 (`strict` mode) |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| Forms | Typed Reactive Forms |
| UI | Angular Material 22 (Material Design 3) |
| Charts | Chart.js 4 + ng2-charts |
| Dates | date-fns (pt-BR DatePicker) |
| Styles | SCSS |
| Tests | Vitest |

---

## Getting started

### Prerequisites
- Node.js `^22.22.3`, `^24.15.0`, or `>=26` (required by Angular 22)
- npm 10 or later

### Installation

```bash
git clone <repository-url>
cd cruddashboard
npm install
```

### Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the dev server at `http://localhost:4200` |
| `npm test` | Runs the unit tests |
| `npm run build` | Creates a production build in `dist/` |

---

## Routes

| Route | Screen |
|---|---|
| `/dashboard` | Indicators and charts |
| `/expenses` | Expense list with filters |
| `/expenses/new` | New expense |
| `/expenses/:id/edit` | Edit expense |

Features are loaded on demand (**lazy loading**).

---

## Architecture

The code is organized into **feature packages**: each business feature groups
its own models, state, services, and components.

```text
src/app/
├── core/                    # Infrastructure used across the whole app
│   ├── config/              #   DatePicker date formats
│   ├── models/              #   LoadStatus
│   └── services/            #   LocalStorageService
│
├── shared/                  # Reusable pieces, independent of any feature
│   ├── components/          #   PageHeader, EmptyState, ConfirmDialog
│   ├── utils/               #   pure date and currency functions
│   └── validators/          #   form validators (positiveNumber, notBlank)
│
├── features/
│   ├── expenses/            # Expense registration and listing
│   │   ├── models/          #   Expense, categories, filters, display metadata
│   │   ├── data/            #   sample data (seed)
│   │   ├── services/        #   ExpenseRepository + implementations, pure filters and aggregations
│   │   ├── state/           #   Signal-based ExpenseStore
│   │   ├── components/      #   ExpenseForm, ExpenseFiltersBar, ExpenseTable
│   │   ├── pages/           #   ExpenseListPage, ExpenseFormPage
│   │   ├── testing/         #   test fixtures
│   │   └── expenses.routes.ts
│   │
│   └── dashboard/           # Indicators and charts
│       ├── services/        #   Chart.js data mappers and options
│       ├── components/      #   StatCard, ChartCard, and the three charts
│       ├── pages/           #   DashboardPage
│       └── dashboard.routes.ts
│
├── app.config.ts            # global providers
├── app.routes.ts            # root routes
└── app.ts                   # shell: toolbar, navigation, and <router-outlet>
```

### Dependency rules

```text
features  ──►  shared  ──►  core
    │                        ▲
    └────────────────────────┘
```

- `core` does not depend on any other layer of the app.
- `shared` may depend on `core`, but never on a feature.
- Features depend on `core` and `shared`.
- `dashboard` reads expense data only through the public API of `ExpenseStore`
  (and the types in `models/`). It never accesses persistence directly.

### State management

Expense state is centralized in `ExpenseStore`, a Signal-based service:

- writable state is **private** and exposed as read-only (`asReadonly()`);
- all derived data (filters, totals, chart series) is calculated with `computed()`;
- `effect()` is used only for real side effects, such as writing to localStorage.

### Components

| Page component (`pages/`) | Presentational component (`components/`) |
|---|---|
| Bound to a route | Unaware of routing |
| Injects the store and services with `inject()` | Receives data via `input()` |
| Orchestrates state reads and actions | Emits events via `output()` |

### Import aliases

```ts
import { LocalStorageService } from '@core/services/local-storage.service';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ExpenseStore } from '@features/expenses/state/expense.store';
```

---

## Tests

```bash
npm test
```

| File | Coverage |
|---|---|
| `expense.store.spec.ts` | loading, CRUD, dashboard `computed()` values, filters, persistence `effect()` |
| `expense-filters.spec.ts` | case- and accent-insensitive search, category, date range, combined filters |
| `expense-stats.spec.ts` | sum, largest expense, average, totals by category and by month |
| `local-storage-expense.repository.spec.ts` | initial seed, CRUD, discarding invalid records |
| `expense-form.spec.ts` | validation, form output, populating the form when editing |
| `chart-data.spec.ts` | conversion to Chart.js format, fixed color per category |
| `form.validators.spec.ts`, `expenses.mock.spec.ts`, `app.spec.ts` | validators, sample data, app shell |
