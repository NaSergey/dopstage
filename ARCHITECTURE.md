# Архитектура проекта Dopamine-UI

Документ описывает структуру кода, соглашения и паттерны проекта, чтобы их можно было перенести в другой проект.

---

## 1. Технологический стек

| Категория | Технология |
|---|---|
| Фреймворк | **Next.js 16** (App Router, `output: "standalone"`, Turbopack) |
| Язык | TypeScript 5 (strict) |
| UI / React | React 19 |
| Стилизация | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css` |
| Компоненты | shadcn/ui (style "new-york", base color zinc) + Radix UI |
| Данные / запросы | `@tanstack/react-query` v5 + `openapi-fetch` + `openapi-react-query` |
| Кодоген API | `openapi-typescript` (типы из OpenAPI-схемы) |
| Состояние | `zustand` (+ `immer` middleware), React Context (точечно) |
| Формы | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Таблицы | `@tanstack/react-table` |
| Графики | `lightweight-charts`, `d3` |
| Прочее | `embla-carousel`, `sonner` (тосты), `nextjs-toploader`, `next-themes`, `html-to-image`, `simplebar-react` |

Скрипты (`package.json`):
- `dev` / `build` — с `--turbopack`
- `start` — порт **3002**
- `typecheck` — `tsc --noEmit`
- `lint` — `eslint`
- `check` — `lint && typecheck`
- `api` — регенерация типов: `npx openapi-typescript <openapi-url> -o ./src/shared/api/schema/generated.ts`

---

## 2. Архитектура: Feature-Sliced Design (FSD)

Код разбит на **слои** (layers). Импорты идут строго **сверху вниз** (вышестоящий слой использует нижестоящие, не наоборот):

```
app        →  маршруты Next.js + сборка страниц из слайсов
widgets    →  крупные самостоятельные блоки UI (header, footer, running-line, …)
features   →  пользовательские сценарии (auth, таблицы-лидерборды)
entities   →  бизнес-сущности (user-profile, x-feed-search, …)
shared     →  переиспользуемый фундамент (api, ui, lib, hooks, config, assets)
```

Реальная структура `src/`:

```
src/
├── app/            # Next.js App Router (маршруты + page-специфичный код)
├── widgets/        # header, footer, running-line, mobile-guard, snake-games
├── features/       # auth, programs-leaderboard-table
├── entities/       # multi-users-images, user-profile, x-feed-search
├── shared/         # api, ui, lib, hooks, config, fonts, assets
└── types.d.ts      # глобальные типы
```

### Внутренняя сегментация слайса

Внутри слайса (особенно крупного) повторяется одна и та же структура сегментов:

```
<slice>/
├── ui/         # презентационные компоненты
├── model/      # типы, контексты, конфиги, состояние
├── lib/        # чистые функции / хелперы слайса
├── hooks/      # хуки слайса
└── components/ # вложенные подкомпоненты
```

Пример (слайс `receptors` на главной странице):

```
src/app/(main)/ui/receptors/
├── receptors.tsx                  # server-обёртка
├── receptors-client.tsx           # клиентская часть
├── generate-mock-data.ts
├── model/receptor-selection-context.tsx   # React Context для выбора
└── ui/
    ├── info-panel.tsx, receptor-line.tsx, …
    └── chart/
        ├── chart.tsx
        ├── hooks/   (use-chart-filters, use-labels-overlay, use-stacked-area-series)
        ├── lib/     (adapter-data, color, create-receptor-chart, stacked-area, time, utils)
        ├── model/   (chart-config, types)
        └── ui/      (chart-view, labels-overlay, tooltip-overlay, …)
```

---

## 3. Маршрутизация (App Router) и соглашения

В `src/app` используется App Router. **Важное соглашение проекта:**

- **Route groups в скобках** — `(main)`, `(create-program)`, `(leaderboard-creators)`, `(internal)` — используются как **организационные контейнеры**, а НЕ как маршруты. Внутри них page-файл назван **`pages.tsx`** (множественное число), поэтому Next.js НЕ создаёт по нему роут. Их UI импортируется в реальные страницы.
  - Например, корневой [src/app/page.tsx](src/app/page.tsx) собирает страницу из `(main)/ui/...`, `widgets/...`, `features/...`.
- **Реальные маршруты** имеют `page.tsx`:
  - `/` → `src/app/page.tsx`
  - `/dopaminer/[id]` → `src/app/dopaminer/[id]/page.tsx`
  - `/subnet/[id]` → `src/app/subnet/[id]/page.tsx`
  - `/leaderboard`, `/faq`, `/graph`, `/maintenance`
- **`layout.tsx`** есть и в группах, и в маршрутах. Корневой [src/app/layout.tsx](src/app/layout.tsx) подключает шрифты, `Providers`, `MobileGuard`, `NextTopLoader`.
- **Композиция страницы:** `layout.tsx` собирает крупные блоки из `widgets` (Header, Footer, RunningLine), а `page.tsx` раскладывает контентные слайсы по сетке.

### Page-специфичный код живёт рядом с маршрутом

Код, относящийся к одной странице, держится внутри её папки маршрута, а не в глобальных слоях:

```
src/app/subnet/[id]/
├── page.tsx
├── layout.tsx
├── components/   (chart/, header/, leaderboard/, top-tweets/, xfeed/, yapper-check/, …)
├── store/yapper-store.ts        # локальный zustand-store страницы
└── utils/twitter.ts
```

То есть FSD-сегменты (`components/`, `store/`, `utils/`, `hooks/`, `lib/`, `model/`) применяются и на уровне отдельного маршрута.

---

## 4. Слой API (`src/shared/api`)

```
src/shared/api/
├── schema/
│   ├── swagger.yaml      # исходная OpenAPI-схема
│   ├── generated.ts      # СГЕНЕРИРОВАННЫЕ типы (openapi-typescript) — не редактировать
│   └── index.ts          # реэкспорт: ApiPaths, ApiComponents
├── instance.ts           # КЛИЕНТСКИЙ клиент (react-query)
├── server.ts             # СЕРВЕРНЫЙ fetch-клиент (RSC)
└── query-client.ts       # настройки QueryClient
```

Типы из схемы (`src/shared/api/schema/index.ts`):
```ts
export type ApiPaths = paths;                       // все эндпоинты
export type ApiComponents = components["schemas"];  // DTO/модели
```
Использование: `ApiComponents["TopProgramResponse"]` вместо ручных интерфейсов.

> `tsconfig.json` исключает `src/shared/api/**` из проверки типов (сгенерированный код).

### Клиентский клиент — `instance.ts`
```ts
const fetchClient = createFetchClient<ApiPaths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export const rqClient = createClient(fetchClient); // openapi-react-query
```
Даёт типобезопасные `rqClient.useQuery(...)`, `rqClient.useInfiniteQuery(...)` прямо по путям OpenAPI.

### Серверный клиент — `server.ts`
```ts
export const serverFetchClient = createFetchClient<ApiPaths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  fetch: async (request, options) => { /* прокидывание headers, поддержка next.revalidate/tags */ },
});
```
Используется в server-компонентах с `next: { revalidate: 300 }`.

### QueryClient — `query-client.ts`
```ts
new QueryClient({ defaultOptions: { queries: {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
}}});
```

---

## 5. Паттерны загрузки данных

### Server Component (RSC) → начальные данные
В файле `*-server.tsx` или `<slice>.tsx` функция-фетчер дёргает `serverFetchClient.GET(...)` с `revalidate`, оборачивает в try/catch и возвращает `data || []`, затем передаёт в клиентский компонент как `initialData`.

Примеры: [programs-panel.tsx](src/app/(main)/ui/programs-panel/programs-panel.tsx), [programs-leaderboard-table-server.tsx](src/features/programs-leaderboard-table/programs-leaderboard-table-server.tsx).

### Client Component → живое обновление с гидрацией
Клиентский `*-client.tsx` берёт `initialData` и подключает `rqClient.useQuery(...)`:
```ts
const { data, isLoading, error, refetch } = rqClient.useQuery(
  "get",
  "/api/v1/main_page/featured_programs",
  { params: { query: { limit: 13 } } },
  {
    initialData,                                   // гидрация из RSC
    keepPreviousData: true,
    placeholderData: (prev) => prev,
    refetchInterval: refetchInterval(INTERVAL),    // из shared/lib/error
    refetchOnReconnect,
    staleTime: INTERVAL - STALE_TIME_BUFFER,
  },
);
```
Пример: [programs-panel-client.tsx](src/app/(main)/ui/programs-panel/ui/programs-panel-client.tsx).

### Хук-обёртка над запросом
Логику запроса часто выносят в локальный хук слайса (`hooks/use-*.ts`): берёт параметры из `useParams`, настраивает `useInfiniteQuery`, мемоизирует и плоско сшивает страницы, возвращает производное состояние (`hasError`, `showReload`).
Пример: [use-top-tweets.ts](src/app/subnet/[id]/components/top-tweets/hooks/use-top-tweets.ts).

### Интервалы обновления
Тайминги вынесены в `.env` по каждой странице/панели (`NEXT_PUBLIC_*_INTERVAL`), с фолбэком на константы из [refetchInterval.ts](src/shared/lib/constants/refetchInterval.ts):
```
DEFAULT_REFETCH_INTERVAL = 60000
LONG_REFETCH_INTERVAL    = 300000
STALE_TIME_BUFFER        = 5000
```

---

## 6. Управление состоянием

- **Zustand (+ immer)** — для клиентского состояния.
  - Глобально: [src/features/auth/auth-store.ts](src/features/auth/auth-store.ts) — `useAuthStore` с `immer` middleware, инварианты в экшенах.
  - Локально на странице: `src/app/subnet/[id]/store/yapper-store.ts`, `src/app/(create-program)/store/use-create-campaign-store.ts`.
- **React Context** — для локального UI-состояния внутри слайса (например, выбор в `receptors/model/receptor-selection-context.tsx`).
- **URL как состояние** — параметры списков/фильтров в URL; маппинг frontend↔API вынесен в `lib`:
  [leaderboard-params.ts](src/app/leaderboard/lib/leaderboard-params.ts) (`toApiParams`, словари `FRONTEND_PARAMS`/`API_PARAMS`).
- **React Query** — серверное состояние (кэш ответов API).

---

## 7. Обработка ошибок (`src/shared/lib/error`)

Единый слой с одной точкой импорта через `index.ts`:
```
error/
├── index.ts                       # реэкспорт + isErrorOfType / isNotFoundError / refetchInterval / refetchOnReconnect
├── error-codes.ts                 # наборы статусов (NOT_FOUND_STATUSES, NO_SUCH_USER_STATUSES, …)
├── get-error-status.ts            # извлечение HTTP-статуса из ошибки
├── match-error.ts
├── business/no-such-user.error.ts # доменные ошибки
├── hooks/use-error-state.ts       # хук: { hasError, showReload }
└── ui/reload-policy.ts            # shouldShowReload
```
Ключевая идея: предикаты-обёртки для React Query, которые **останавливают рефетч на «фатальных» статусах** (404/422):
```ts
refetchInterval(ms)      // → (query) => статус из NO_SUCH_USER_STATUSES ? false : ms
refetchOnReconnect(query)// → !isNotFound
```
Компоненты импортируют всё одной строкой: `import { useErrorState, refetchInterval, refetchOnReconnect } from "@/shared/lib/error"`.

---

## 8. Слой `shared/lib`

```
shared/lib/
├── constants/   (links.ts, refetchInterval.ts)
├── error/       (см. выше)
├── format/      (formatNumber, formatK, formatAddress, dateWithoutYear, getTimeAgo, toPercent)
├── hooks/       (use-is-mounted, use-table-changes, useTableNavigation)
└── utils/       (css → cn(), color, copy-to-clipboard, frame-geometry, image, utils)
```
`cn()` — стандартный shadcn-хелпер ([css.ts](src/shared/lib/utils/css.ts)): `twMerge(clsx(inputs))`.

Хуки разнесены по уровням:
- `src/shared/hooks/` — общие (`useDebounce`, `useScreenSize`, `useScrollGradients`).
- `src/shared/lib/hooks/` — связанные с lib/таблицами.
- `<slice>/hooks/` — хуки конкретного слайса/страницы.

---

## 9. Слой `shared/ui` (дизайн-система)

shadcn/ui-компоненты + кастомные. Конфиг в [components.json](components.json):
```
aliases: components→@/shared/components, ui→@/shared/ui,
         utils→@/shared/lib/utils/css, lib→@/shared/lib, hooks→@/shared/lib/react
```

Состав:
- **Примитивы:** `button`, `input`, `select`, `dialog`, `dropdown-menu`, `tooltip`, `switch`, `table`, `textarea`, `pagination`, `skeleton`, `sonner`, `carousel`.
- **Обёртки приложения:** `app-image`, `app-input`, `app-link`, `app-select`, `app-tooltip` (префикс `app-` = доменная обёртка над примитивом).
- **Композиты:** `data-table` (+ `data-table/animated-table-cell`, `memoized-table-row`), `sparkline/`, `marquee/`, `octagon-frame`, `frame-surface`, `progress-bar`, `search-input`, `empty-state`.
- **Иконки:** `src/shared/ui/icons/` — категоризированы по папкам (`actions/`, `crypto/`, `social/`, `status/`, `filters/`, `rating/`, `ui-controls/`, …) с общим бочкой `icons/index.ts`. Каждая иконка — отдельный tsx-компонент.
- **Стили:** `src/shared/ui/styles/` (`buttons.css`, `components.css`, `shapes.css`, `table.css`, `index.css`) + глобальный `src/app/globals.css`.

---

## 10. Слои widgets / features / entities

- **widgets/** — самодостаточные блоки страницы: `header/` (+ `components/`), `footer/`, `running-line/`, `mobile/mobile-guard.tsx`, `snake-games/`. Внутри — своя сегментация `components/`.
- **features/** — сценарии: `auth/` (`auth.tsx` + `auth-store.ts`), `programs-leaderboard-table/` (server-обёртка + `components/columns,table` + `mock/`).
- **entities/** — бизнес-сущности как переиспользуемые компоненты: `user-profile.tsx`, `multi-users-images.tsx`, `x-feed-search.tsx`.

Паттерн «server + client» повторяется и в фичах: `*-server.tsx` (RSC, фетч + `initialData`) → `*-table.tsx`/`*-client.tsx` (клиент, react-query + react-table).

---

## 11. Соглашения об именовании

- Файлы — **kebab-case**: `programs-panel-client.tsx`, `use-top-tweets.ts`.
- `*-server.tsx` — серверный компонент с фетчем; `*-client.tsx` — клиентский (`"use client"`).
- `*-skeleton.tsx` — состояние загрузки рядом с компонентом.
- Хуки — `use-*.ts`. Сторы zustand — `*-store.ts` или `use-*-store.ts`.
- Иконки — `*-icon.tsx`.
- `pages.tsx` (мн. ч.) в route-group ≠ маршрут; `page.tsx` (ед. ч.) = маршрут.
- Сегменты слайса: `ui/`, `model/`, `lib/`, `hooks/`, `components/`, `store/`, `utils/`.

---

## 12. Конфигурация и алиасы

- **Алиас путей** ([tsconfig.json](tsconfig.json)): `@/*` → `./src/*`. Импорты — всегда через `@/...`.
- **next.config.ts:** `output: "standalone"` (минимальный Docker-образ), `images.remotePatterns` разрешает любые http/https хосты.
- **Env-переменные:**
  - `.env.development` / `.env.production`: `NEXT_PUBLIC_API_URL` (+ `NEXT_PUBLIC_MOCK_API_URL` в dev).
  - `.env`: набор `NEXT_PUBLIC_*_INTERVAL` — интервалы рефетча по каждой панели/странице.
  - Все клиентские переменные с префиксом `NEXT_PUBLIC_`.
- **Шрифты** ([fonts.ts](src/shared/config/fonts.ts)): локальные через `next/font/local` (`chivo`, `chivoMono`), подключаются CSS-переменными в корневом layout.
- **Деплой:** `Dockerfile` + `docker-compose.yml` + `.github/workflows/deploy-staging.yml` (CI на staging), `dependabot.yml`.

---

## 13. Чек-лист для переноса в новый проект

1. Поднять Next.js (App Router) + TypeScript strict; алиас `@/* → ./src/*`.
2. Создать слои FSD: `app / widgets / features / entities / shared`.
3. Слой `shared/api`:
   - положить OpenAPI-схему, настроить скрипт `api` для `openapi-typescript`;
   - `instance.ts` (openapi-react-query, клиент), `server.ts` (RSC-fetch с revalidate), `query-client.ts`;
   - `schema/index.ts` с реэкспортом `ApiPaths` / `ApiComponents`; исключить `shared/api/**` из tsconfig.
4. `shared/lib`: `error/` (предикаты для react-query), `format/`, `utils/css.ts` (`cn`), общие хуки.
5. `shared/ui`: shadcn (`components.json`, aliases), `icons/` по категориям + барель, `styles/`.
6. Паттерн данных: RSC-фетч → `initialData` → клиент с `rqClient.useQuery` (+ `staleTime`, `refetchInterval` из error-слоя).
7. Состояние: zustand+immer (глобально и локально по страницам), Context для локального UI, URL-параметры через `lib`.
8. Соглашения: kebab-case, `*-server`/`*-client`/`*-skeleton`, `pages.tsx` для организационных групп, сегменты `ui/model/lib/hooks` внутри слайсов.
9. Провайдеры в корневом layout: `QueryClientProvider`, `Toaster` (sonner), `NextTopLoader`, шрифты.
10. Env: `NEXT_PUBLIC_API_URL` + интервалы `NEXT_PUBLIC_*_INTERVAL`; деплой через `output: "standalone"` + Docker.
</content>
</invoke>
