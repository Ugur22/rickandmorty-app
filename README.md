# Rick & Morty Lookup

A small app to search Rick & Morty characters and episodes, built against the
[Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql) for a
frontend assessment. The brief was time-boxed to ~4 hours; the core (search, detail pages,
loading/error states) stayed within that, and the extra time went into the bonus Analytics
page below.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run test      # vitest
npm run build     # production build
```

## What it does

- **Characters** (`/`) — search characters by name, browse the results, click through to a
  detail page with the character's image, status, species, gender, origin, and last known
  location, plus every episode they appear in.
- **Episodes** (`/episodes`) — a single search box that accepts either an episode name
  (e.g. "Pilot") or its code (e.g. "S01E01"), auto-detected client-side.
- **Analytics** (`/analytics`, bonus) — a dashboard aggregated across every episode and
  location in the API: cast size per episode, cast size trend per season (sparklines), and
  a top-10 breakdown of locations by dimension. Tiles are drag-to-reorder (via `swapy`) and
  the order persists to `localStorage`. See [Bonus: Analytics](#bonus-analytics) below.
- **Dark mode** — a header toggle switches the whole app between light and dark, persisted
  across visits.

## Tech choices

- **Vite + React + TypeScript (strict)**.
- **Apollo Client** against `https://rickandmortyapi.com/graphql` — chosen over the REST API
  per the assessment brief. The character-detail query pulls the character's `episode` field
  directly, so no second round-trip is needed to list the episodes they appear in.
- **Tailwind CSS v4** via the official Vite plugin.
- **Apollo owns server state; Redux Toolkit owns the one piece of cross-cutting client
  state.** Per-page state (search text, current page) stays local `useState` — it's not
  shared outside the component that owns it. Theme mode is different: it's read by the
  header toggle, persisted to `localStorage`, *and* read by every chart in Analytics to pick
  a light/dark palette (Recharts renders to SVG, so it can't just inherit Tailwind's `dark:`
  classes). Prop-drilling that into three chart components wasn't worth it, so it's the one
  slice of global state in the app (`app/store.ts`, `features/theme/themeSlice.ts`).
- **Feature-based folders** (`features/characters`, `features/episodes`, `features/analytics`,
  `features/theme`, `shared/`).
- **`ts-pattern`** for the two genuinely discriminated-union spots: classifying a search string
  as a code/name/empty (`features/episodes/utils/episodeSearchClassifier.ts`), and rendering
  Apollo's loading/error/empty/success states consistently across both list pages
  (`shared/types/queryState.ts`). Both matches are `.exhaustive()`, so an unhandled case is a
  compile error, not a runtime gap.
- **No GraphQL codegen** — types are hand-written per query. Tradeoff: they can drift if the
  API shape changes, acceptable for a fixed public API on a 4-hour budget.
- **A few targeted tests** (Vitest + React Testing Library + Apollo's `MockedProvider`), not full
  coverage: the search classifier's branches, that both list pages render results, that the
  episode page sends the *right* query variable (`name` vs `episode`) for each kind of input,
  and that both pages skip the query and show a hint under the minimum search length.

## Search performance

- **Debounce** (`shared/hooks/useDebouncedValue.ts`, 350ms) — a query only fires once typing
  pauses, not per keystroke.
- **Minimum search length** (`shared/searchConfig.ts`, 3 chars) — below that, the query is
  `skip`ped via Apollo's `useQuery({ skip })` and a "keep typing" hint is shown instead. This
  avoids firing broad 1-2 character queries that would match a large chunk of the dataset.
  Episode *code* searches are exempt: the classifier's regex already requires at least 3
  characters to match a code at all, so the gate only applies to name searches.
- **Memoization** — `CharacterCard` and `EpisodeListItem` are wrapped in `React.memo`. Typing in
  the search box re-renders the page (the input is controlled) on every keystroke, but the
  debounced query only refires occasionally; without `memo`, every list item would still
  re-render on each keystroke even though its `character`/`episode` prop reference is unchanged
  between Apollo cache reads. No other memoization (`useMemo`/`useCallback`) is applied — the
  rest of the app doesn't have expensive computations or unstable callback identities that would
  benefit from it, so adding it there would just be overhead for its own sake.

## GraphQL query design

- **Fragments colocated with the components that consume them.** `EpisodeListItemFields`
  (`features/episodes/components/EpisodeListItem.tsx`) and `CharacterCardFields`
  (`features/characters/components/CharacterCard.tsx`) are defined next to the component that
  renders exactly those fields, then spread into every query that feeds that component.
  `EpisodeListItemFields` in particular is spread into both `SEARCH_EPISODES` and `GET_CHARACTER`
  (a character's `episode` sub-selection) — before this, the same four fields were hand-typed out
  twice across two query files, which is exactly the kind of drift a fragment prevents: change
  what the list item needs once, both queries pick it up.
- **Query documents are typed once, at the source.** Each query constant is annotated as
  `TypedDocumentNode<TData, TVariables>` (e.g. `SEARCH_CHARACTERS: TypedDocumentNode<SearchCharactersData, SearchCharactersVars>`)
  rather than passing `useQuery<TData, TVariables>(...)` generics at every call site — the latter
  is deprecated in Apollo Client 4 and, more importantly, is a second place the two types could
  drift out of sync with the query they're paired with.
- **Gotcha hit while wiring this up**: `MockedProvider` test fixtures must include `__typename` on
  mocked objects once a query reads a field through a named fragment. Apollo's cache checks a
  fragment's `on Episode`/`on Character` type condition before including its fields on read;
  without `__typename` in the mock payload that check silently fails and the field comes back
  empty rather than erroring. Inline (non-fragment) field selections don't have this requirement,
  which is why it only surfaced after introducing fragments.

## Loading states

Both list pages and the character detail page render skeleton placeholders shaped like the real
content (`*Skeleton.tsx` components, built on a shared `shared/components/Skeleton.tsx` pulse
primitive) instead of a generic spinner — this avoids layout shift when results arrive and reads
as "the page is already there, just filling in."

## Bonus: Analytics

`/analytics` (`features/analytics/`) aggregates across the *entire* dataset rather than one
page of results, so it needed its own data path:

- **`useFetchAllPages`** (`hooks/useFetchAllPages.ts`) walks a paginated query end-to-end via
  `client.query` in a loop (following `info.next` until it's `null`), independent of Apollo's
  normal `useQuery`-per-page flow used elsewhere in the app.
- **Aggregation is plain functions, not components** (`utils/aggregate.ts`), so it's unit-tested
  directly (`aggregate.test.ts`) without rendering anything: cast size per episode, cast size
  grouped by season (parsed from the episode code, e.g. `"S01E01"` → season `"S01"`), and
  location counts by dimension, with the API's inconsistent "unknown dimension" sentinels
  (`''`, `'unknown'`, `'Unknown dimension'`) collapsed into one bucket and long tails folded
  into an "Other" bucket past the top 10 — otherwise the chart is mostly illegible slivers.
- **Recharts** for the charts themselves — SVG-based, so it renders crisply at any size and
  doesn't drag in a canvas runtime for what's fundamentally three simple charts.
- **`swapy`** for drag-to-reorder tiles — a small, unopinionated library that works directly
  against existing DOM nodes (`data-swapy-slot`/`data-swapy-item` attributes) rather than
  owning its own component tree, so it drops into the existing tile markup instead of
  requiring the charts to be restructured around it. Order persists to `localStorage`.
- Charts read `theme.mode` from Redux directly (`useAppSelector`) rather than through CSS,
  since Recharts' colors are JS props, not classes Tailwind's `dark:` variant can reach.
- The `/analytics` route is lazy-loaded (`router.tsx`) so Recharts' bundle weight is only paid
  by visitors who actually open the page.

## Known limitations (explicit tradeoffs for the time budget)

- No URL-synced search state (`?q=`) — searches aren't shareable/bookmarkable.
- Pagination is a bare prev/next, no jump-to-page.
- The public API rate-limits aggressively under rapid successive requests (observed during
  testing as a CORS-looking `Failed to fetch`, which is actually a non-2xx response missing
  CORS headers) — not something the app works around, since Apollo has no retry link configured.
  `useFetchAllPages` is the most exposed to this, since it fires every page of a paginated
  query back-to-back with no throttling between requests.
