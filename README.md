# Rick & Morty Lookup

A small app to search Rick & Morty characters and episodes, built against the
[Rick and Morty GraphQL API](https://rickandmortyapi.com/documentation/#graphql) for a
frontend assessment. Time-boxed to ~4 hours, so the tech choices below favor a lean, correct,
well-organized app over maximal engineering.

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

## Tech choices

- **Vite + React + TypeScript (strict)**.
- **Apollo Client** against `https://rickandmortyapi.com/graphql` — chosen over the REST API
  per the assessment brief. The character-detail query pulls the character's `episode` field
  directly, so no second round-trip is needed to list the episodes they appear in.
- **Tailwind CSS v4** via the official Vite plugin.
- **No global state library.** Apollo's cache already owns server state; the only client state
  (search text, current page) is local `useState`, added per-component rather than centralized.
- **Feature-based folders** (`features/characters`, `features/episodes`, `shared/`).
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

## Known limitations (explicit tradeoffs for the time budget)

- No URL-synced search state (`?q=`) — searches aren't shareable/bookmarkable.
- Pagination is a bare prev/next, no jump-to-page.
- The public API rate-limits aggressively under rapid successive requests (observed during
  testing as a CORS-looking `Failed to fetch`, which is actually a non-2xx response missing
  CORS headers) — not something the app works around, since Apollo has no retry link configured.
- No bonus feature implemented (left for after core review).
