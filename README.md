# Folio Web Prototype

A clickable Next.js prototype of the Folio book-based social app. UI/UX demo only — all data is mocked, no real backend.

**Tech:** Next.js 16 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Zustand

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Walk-through

1. **`/welcome`** → 開始旅程 → 4-page onboarding
2. **`/auth`** → 「以 Alice demo 帳號繼續」(skip registration, jump to discover with mock posts)
3. **`/discover`** → see mock posts (Alice / Ben / Cleo / Dan), filtered by your stance
4. **`/discover/post/{id}`** → post detail → 「我要申請」or 「查看申請者」
5. **`/discover/new`** → create your own post
6. **`/apply/{postId}`** → apply to someone's post (mirror form, auto-signed)
7. **`/room/{id}`** → common room (locked chat) → update progress → 25% 心得 → unlock chat
8. **`/room/{id}/update`** → progress slider, free notes, milestone prompts
9. **`/room/{id}/chat`** → chat after unlock
10. **`/shelf`** → solo bookshelf, add books without pairing
11. **`/shelf/{bookId}`** → per-book progress + notes
12. **`/shelf/{bookId}/compilation`** → 100% sticky-note compilation page (shareable)
13. **`/me`** → profile with cooldown-aware edits

## Reset Demo

Clear localStorage and reload:

```js
localStorage.removeItem('folio_state'); location.reload();
```

## Run Tests

```bash
npm test
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npx vercel --prod
```

(Requires Vercel CLI login: `npx vercel login`)

## Project Structure

```
app/
├── (onboarding)/      # Welcome + 4-page intro + auth
├── (main)/            # Main app: discover, room, shelf, me (with bottom nav)
└── register/          # 4-step registration flow
components/
├── ui/                # Button, Modal, Input, Textarea, PageContainer
├── feed/              # PostCard, StanceBadge
├── room/              # ProgressCard, StickyNoteWall, ChatLog, Celebration
├── notes/             # StickyNote, NotePromptModal
├── shelf/             # BookRow
├── me/                # EditFieldModal, EditCategoriesModal, EditQAModal
├── onboarding/        # PageDots, SocialButton
└── shared/            # BottomNav, RegisterStepper, PageTransition, ProgressSlider, BookPicker, StoreHydrator
lib/
├── store.ts           # Zustand state + types
├── persistence.ts     # localStorage sync
├── mock-data.ts       # seed users / books / posts
├── filters.ts         # stance feed-filter matrix
├── cooldown.ts        # cooldown calc
├── unlock.ts          # chat unlock logic
├── signature.ts       # apply-form signature
├── format-time.ts     # chat day labels & local time
├── note-prompts.ts    # 25% / 100% prompt copy
├── stance-meta.ts     # stance labels
├── book-categories.ts # preset categories
└── onboarding-content.ts
tests/lib/             # vitest TDD tests for all logic libs
```

## Specs

See `docs/superpowers/specs/2026-05-07-folio-app-design.md` for full design + flowcharts.
See `docs/superpowers/plans/2026-05-07-folio-demo-prototype.md` for the implementation plan.
