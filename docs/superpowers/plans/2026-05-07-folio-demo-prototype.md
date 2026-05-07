# Folio Demo Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個 Next.js 可點選 prototype，覆蓋 Folio 設計文件 (`docs/superpowers/specs/2026-05-07-folio-app-design.md`) 的所有主要使用流程（註冊、探索、發 post、申請、共讀室、心得、100% 整理頁、書櫃、Profile）。供 UI/UX 內測使用、無真實後端。

**Architecture:** Next.js 15 App Router + React + TypeScript + Tailwind v4 + Framer Motion + Zustand。所有狀態存在前端 + localStorage。Mock auth、mock posts、mock users。Mobile-first 響應式，溫暖水彩風格。

**Tech Stack:** Next.js 15、React 19、TypeScript 5、Tailwind CSS v4、Framer Motion、Zustand、lucide-react

---

## 跨 Phase 約定

- **顏色 token**（Tailwind v4 `@theme`）：
  - `--color-parchment: #F8F1E4`（背景）
  - `--color-cream: #FAF3E7`（卡片）
  - `--color-sage: #6B8064`（CTA）
  - `--color-sage-dark: #556650`（hover）
  - `--color-walnut: #3D2F1F`（主要文字）
  - `--color-walnut-soft: #6B5A47`（次要文字）
  - `--color-tag: #C9B89A`（badge / 邊線）
- **字型**：
  - 標題：`Cormorant Garamond`（拉丁）+ `Noto Serif TC`（中文）
  - 內文：`Noto Sans TC`
- **容器**：`max-w-[480px] mx-auto min-h-screen` 全部頁面共用
- **localStorage key**：`folio_state`
- **路由前綴**：所有功能頁在 `/app/(main)/...`、onboarding 在 `/app/(onboarding)/...`
- **TDD 範圍**：純視覺 component 不強制 TDD；含邏輯（store、cooldown、filter matrix、解鎖狀態機、署名生成）必須先寫測試
- **Commit 訊息格式**：`feat(<phase>): <task>`、`fix(<phase>): <task>`

---

## File Structure（建立後不再大改）

```
folio_web_proto/
├── app/
│   ├── (onboarding)/
│   │   ├── layout.tsx
│   │   ├── welcome/page.tsx
│   │   ├── intro/[step]/page.tsx
│   │   └── auth/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # 含底部 nav
│   │   ├── discover/page.tsx
│   │   ├── discover/post/[id]/page.tsx
│   │   ├── discover/new/page.tsx
│   │   ├── apply/[postId]/page.tsx
│   │   ├── room/[id]/page.tsx
│   │   ├── shelf/page.tsx
│   │   ├── shelf/[bookId]/page.tsx
│   │   ├── shelf/[bookId]/compilation/page.tsx
│   │   └── me/page.tsx
│   ├── register/
│   │   ├── basic/page.tsx
│   │   ├── qa/page.tsx
│   │   ├── stance/page.tsx
│   │   └── confirm/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # 通用元件（按鈕、輸入框、modal）
│   ├── onboarding/
│   ├── feed/
│   ├── room/
│   ├── notes/
│   └── shared/
├── lib/
│   ├── store.ts                   # Zustand 主 store
│   ├── persistence.ts             # localStorage 同步
│   ├── filters.ts                 # 心態 feed 過濾矩陣
│   ├── cooldown.ts                # 冷卻邏輯
│   ├── unlock.ts                  # 聊天解鎖狀態機
│   └── mock-data.ts               # 預載 mock 用戶、書、貼文
├── public/
│   └── illustrations/             # 水彩 PNG 放這裡
├── tests/
│   ├── lib/
│   └── components/
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts (Tailwind v4 用 CSS-first 也可省略)
```

---

# Phase 0: Foundation

### Task 0.1: Scaffold Next.js project

**Files:**
- Create: `package.json`、`tsconfig.json`、`next.config.ts`、`app/layout.tsx`、`app/page.tsx`、`app/globals.css`

- [ ] **Step 1: 跑 create-next-app**

```bash
cd /Users/yuki/Desktop/folio_web_proto
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm
```

當被詢問 turbopack 時：選 No（先穩定）

- [ ] **Step 2: 確認 dev server 跑得起來**

Run: `npm run dev`
Expected: localhost:3000 顯示 Next.js 預設頁

- [ ] **Step 3: 加入 git + .gitignore（已由 create-next-app 產生）**

```bash
git init
git add .
git commit -m "feat(phase-0): scaffold Next.js project"
```

---

### Task 0.2: 設計系統 — 顏色與字型 tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: 在 globals.css 用 Tailwind v4 `@theme` 定義 tokens**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-parchment: #F8F1E4;
  --color-cream: #FAF3E7;
  --color-sage: #6B8064;
  --color-sage-dark: #556650;
  --color-walnut: #3D2F1F;
  --color-walnut-soft: #6B5A47;
  --color-tag: #C9B89A;

  --font-display: "Cormorant Garamond", "Noto Serif TC", serif;
  --font-body: "Noto Sans TC", system-ui, sans-serif;
}

html, body {
  background: var(--color-parchment);
  color: var(--color-walnut);
  font-family: var(--font-body);
}
```

- [ ] **Step 2: 載入 Google Fonts**

修改 `app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-cormorant" });
const notoSerifTC = Noto_Serif_TC({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-noto-serif-tc" });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["400","500","700"], variable: "--font-noto-sans-tc" });

export const metadata: Metadata = {
  title: "Folio",
  description: "在書頁之間，遇見懂你的靈魂",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${cormorant.variable} ${notoSerifTC.variable} ${notoSansTC.variable}`}>
      <body className="bg-parchment text-walnut">
        <div className="max-w-[480px] mx-auto min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 加 utility class 至 globals.css**

```css
.font-display { font-family: var(--font-cormorant), var(--font-noto-serif-tc), serif; }
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat(phase-0): add color and font design tokens"
```

---

### Task 0.3: Zustand Store 骨架

**Files:**
- Create: `lib/store.ts`、`lib/persistence.ts`、`tests/lib/store.test.ts`

- [ ] **Step 1: 安裝依賴**

```bash
npm install zustand framer-motion lucide-react
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 2: 建立 vitest 設定**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

加 npm script 至 `package.json`：`"test": "vitest"`

- [ ] **Step 3: 寫 store 失敗測試**

Create `tests/lib/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useFolioStore } from "@/lib/store";

describe("FolioStore", () => {
  beforeEach(() => {
    useFolioStore.setState(useFolioStore.getInitialState());
  });

  it("starts with no current user", () => {
    expect(useFolioStore.getState().currentUserId).toBeNull();
  });

  it("setCurrentUser sets the id", () => {
    useFolioStore.getState().setCurrentUser("user-1");
    expect(useFolioStore.getState().currentUserId).toBe("user-1");
  });

  it("upsertUser adds a user to users map", () => {
    useFolioStore.getState().upsertUser({
      id: "u1", nickname: "Alice", gender: "female", age: 24,
      bookCategories: ["fiction"], qaAnswers: {}, stance: "純粹書友",
      stanceChangedAt: 0, nicknameChangedAt: 0,
    });
    expect(useFolioStore.getState().users["u1"].nickname).toBe("Alice");
  });
});
```

- [ ] **Step 4: 跑測試確認失敗**

Run: `npm test -- --run`
Expected: FAIL — store 不存在

- [ ] **Step 5: 寫 store 最小實作**

Create `lib/store.ts`:

```ts
import { create } from "zustand";

export type Stance = "純粹書友" | "純粹找緣分" | "不拘";
export type ReadingMins = "<1" | "1-3" | "3-7" | "7-14" | "14+";

export type User = {
  id: string;
  nickname: string;
  gender: string;
  age: number;
  bookCategories: string[];
  qaAnswers: { defining?: string; titleOfMyLife?: string; readingHours?: ReadingMins };
  stance: Stance;
  stanceChangedAt: number;       // epoch ms
  nicknameChangedAt: number;
};

export type Book = { id: string; title: string };

export type Note = {
  id: string;
  userId: string;
  bookId: string;
  type: "free" | "milestone_25" | "milestone_100";
  prompt?: string;
  content: string;
  createdAt: number;
};

export type Progress = { userId: string; bookId: string; percent: number; updatedAt: number };

export type Post = {
  id: string;
  ownerId: string;
  bookId: string;
  progressAtPost: number;
  whyRead: string;
  partnerExpectation: string;
  expectedWeeks: number;
  status: "open" | "closed";
  createdAt: number;
};

export type Application = {
  id: string;
  postId: string;
  applicantId: string;
  progressAtApply: number;
  whyRead: string;
  selfOffer: string;
  expectedWeeks: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
};

export type Room = {
  id: string;
  postId: string;
  userAId: string;
  userBId: string;
  bookId: string;
  createdAt: number;
  chatUnlockedAt: number | null;
  celebratedAt: number | null;
};

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: number;
};

type State = {
  currentUserId: string | null;
  users: Record<string, User>;
  books: Record<string, Book>;
  posts: Record<string, Post>;
  applications: Record<string, Application>;
  rooms: Record<string, Room>;
  notes: Record<string, Note>;
  progress: Record<string, Progress>;   // key = `${userId}:${bookId}`
  messages: Record<string, Message>;

  setCurrentUser: (id: string | null) => void;
  upsertUser: (u: User) => void;
  upsertBook: (b: Book) => void;
  upsertPost: (p: Post) => void;
  upsertApplication: (a: Application) => void;
  upsertRoom: (r: Room) => void;
  upsertNote: (n: Note) => void;
  upsertProgress: (p: Progress) => void;
  appendMessage: (m: Message) => void;
};

const initialState = {
  currentUserId: null as string | null,
  users: {} as Record<string, User>,
  books: {} as Record<string, Book>,
  posts: {} as Record<string, Post>,
  applications: {} as Record<string, Application>,
  rooms: {} as Record<string, Room>,
  notes: {} as Record<string, Note>,
  progress: {} as Record<string, Progress>,
  messages: {} as Record<string, Message>,
};

export const useFolioStore = create<State>((set) => ({
  ...initialState,
  setCurrentUser: (id) => set({ currentUserId: id }),
  upsertUser: (u) => set((s) => ({ users: { ...s.users, [u.id]: u } })),
  upsertBook: (b) => set((s) => ({ books: { ...s.books, [b.id]: b } })),
  upsertPost: (p) => set((s) => ({ posts: { ...s.posts, [p.id]: p } })),
  upsertApplication: (a) => set((s) => ({ applications: { ...s.applications, [a.id]: a } })),
  upsertRoom: (r) => set((s) => ({ rooms: { ...s.rooms, [r.id]: r } })),
  upsertNote: (n) => set((s) => ({ notes: { ...s.notes, [n.id]: n } })),
  upsertProgress: (p) =>
    set((s) => ({ progress: { ...s.progress, [`${p.userId}:${p.bookId}`]: p } })),
  appendMessage: (m) => set((s) => ({ messages: { ...s.messages, [m.id]: m } })),
}));

(useFolioStore as any).getInitialState = () => initialState;
```

- [ ] **Step 6: 跑測試確認通過**

Run: `npm test -- --run`
Expected: PASS — 3 tests

- [ ] **Step 7: Commit**

```bash
git add lib/store.ts tests/lib/store.test.ts vitest.config.ts tests/setup.ts package.json package-lock.json
git commit -m "feat(phase-0): add Zustand store with user/book/post/room schema"
```

---

### Task 0.4: localStorage 持久化

**Files:**
- Create: `lib/persistence.ts`、`tests/lib/persistence.test.ts`

- [ ] **Step 1: 寫測試**

Create `tests/lib/persistence.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveState, loadState, FOLIO_STATE_KEY } from "@/lib/persistence";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveState writes JSON to localStorage", () => {
    saveState({ currentUserId: "u1", users: {}, books: {}, posts: {}, applications: {}, rooms: {}, notes: {}, progress: {}, messages: {} });
    const raw = localStorage.getItem(FOLIO_STATE_KEY);
    expect(JSON.parse(raw!).currentUserId).toBe("u1");
  });

  it("loadState returns null when no key", () => {
    expect(loadState()).toBeNull();
  });

  it("loadState parses stored JSON", () => {
    localStorage.setItem(FOLIO_STATE_KEY, JSON.stringify({ currentUserId: "u2" }));
    expect(loadState()!.currentUserId).toBe("u2");
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test -- --run`
Expected: FAIL

- [ ] **Step 3: 寫實作**

Create `lib/persistence.ts`:

```ts
export const FOLIO_STATE_KEY = "folio_state";

type Persisted = {
  currentUserId: string | null;
  users: Record<string, unknown>;
  books: Record<string, unknown>;
  posts: Record<string, unknown>;
  applications: Record<string, unknown>;
  rooms: Record<string, unknown>;
  notes: Record<string, unknown>;
  progress: Record<string, unknown>;
  messages: Record<string, unknown>;
};

export function saveState(state: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FOLIO_STATE_KEY, JSON.stringify(state));
}

export function loadState(): Persisted | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(FOLIO_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: 連結 store 與 localStorage**

修改 `lib/store.ts` 末段，新增：

```ts
import { saveState, loadState } from "./persistence";

export function hydrateFromStorage() {
  const persisted = loadState();
  if (persisted) {
    useFolioStore.setState(persisted as any);
  }
}

useFolioStore.subscribe((state) => {
  saveState({
    currentUserId: state.currentUserId,
    users: state.users,
    books: state.books,
    posts: state.posts,
    applications: state.applications,
    rooms: state.rooms,
    notes: state.notes,
    progress: state.progress,
    messages: state.messages,
  });
});
```

- [ ] **Step 5: 在 root layout 觸發 hydration**

Create `components/shared/StoreHydrator.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { hydrateFromStorage } from "@/lib/store";

export default function StoreHydrator() {
  useEffect(() => { hydrateFromStorage(); }, []);
  return null;
}
```

修改 `app/layout.tsx` 把 `<StoreHydrator />` 放進 `<body>` 的 div 裡（max-w container 上方）。

- [ ] **Step 6: 跑測試 + commit**

```bash
npm test -- --run
git add lib/persistence.ts tests/lib/persistence.test.ts lib/store.ts components/shared/StoreHydrator.tsx app/layout.tsx
git commit -m "feat(phase-0): persist store to localStorage"
```

---

### Task 0.5: Mock data 預載

**Files:**
- Create: `lib/mock-data.ts`

- [ ] **Step 1: 建立 mock 用戶 + 書 + 貼文**

Create `lib/mock-data.ts`:

```ts
import type { User, Book, Post } from "./store";

export const MOCK_USERS: User[] = [
  { id: "demo-self", nickname: "你", gender: "未填", age: 0, bookCategories: [], qaAnswers: {}, stance: "純粹書友", stanceChangedAt: 0, nicknameChangedAt: 0 },
  { id: "alice",  nickname: "Alice",  gender: "female", age: 26, bookCategories: ["小說","哲學"], qaAnswers: { defining: "《小王子》— 永遠保留童心" }, stance: "純粹書友",   stanceChangedAt: 0, nicknameChangedAt: 0 },
  { id: "ben",    nickname: "Ben",    gender: "male",   age: 30, bookCategories: ["科技","商業"], qaAnswers: { titleOfMyLife: "《漫長的告白》" },     stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0 },
  { id: "cleo",   nickname: "Cleo",   gender: "female", age: 23, bookCategories: ["詩集","散文"], qaAnswers: { readingHours: "7-14" },                stance: "純粹找緣分", stanceChangedAt: 0, nicknameChangedAt: 0 },
  { id: "dan",    nickname: "Dan",    gender: "male",   age: 28, bookCategories: ["心理","哲學"], qaAnswers: { defining: "《被討厭的勇氣》" },        stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0 },
];

export const MOCK_BOOKS: Book[] = [
  { id: "b-prince",     title: "小王子" },
  { id: "b-norwegian",  title: "挪威的森林" },
  { id: "b-courage",    title: "被討厭的勇氣" },
  { id: "b-sapiens",    title: "人類大歷史" },
  { id: "b-poetry",     title: "夜的解析" },
];

const NOW = Date.now();
const DAY = 86_400_000;

export const MOCK_POSTS: Post[] = [
  { id: "p1", ownerId: "alice", bookId: "b-prince",    progressAtPost: 30, whyRead: "想重溫童年的寓言、也想找人慢慢聊。", partnerExpectation: "希望是慢慢讀、會停下來思考的人", expectedWeeks: 4, status: "open", createdAt: NOW - 1*DAY },
  { id: "p2", ownerId: "ben",   bookId: "b-sapiens",   progressAtPost: 10, whyRead: "想學人類學的視角",                       partnerExpectation: "願意每週討論一章",            expectedWeeks: 8, status: "open", createdAt: NOW - 2*DAY },
  { id: "p3", ownerId: "cleo",  bookId: "b-poetry",    progressAtPost: 0,  whyRead: "想找人一起慢慢進入詩的世界",             partnerExpectation: "心思細膩、能分享共鳴",         expectedWeeks: 6, status: "open", createdAt: NOW - 3*DAY },
  { id: "p4", ownerId: "dan",   bookId: "b-courage",   progressAtPost: 50, whyRead: "已經讀一半，想找人後半本一起看完",       partnerExpectation: "讀過一些心理學書的最好",        expectedWeeks: 3, status: "open", createdAt: NOW - 4*DAY },
];

export function seedIfEmpty() {
  // 在 first load 時呼叫；只有當 store 沒有任何 users 時才注入
  const { useFolioStore } = require("./store");
  const s = useFolioStore.getState();
  if (Object.keys(s.users).length === 0) {
    MOCK_USERS.forEach(s.upsertUser);
    MOCK_BOOKS.forEach(s.upsertBook);
    MOCK_POSTS.forEach(s.upsertPost);
  }
}
```

- [ ] **Step 2: 在 hydrator 後呼叫 seed**

修改 `components/shared/StoreHydrator.tsx`：

```tsx
"use client";
import { useEffect } from "react";
import { hydrateFromStorage } from "@/lib/store";
import { seedIfEmpty } from "@/lib/mock-data";

export default function StoreHydrator() {
  useEffect(() => {
    hydrateFromStorage();
    seedIfEmpty();
  }, []);
  return null;
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data.ts components/shared/StoreHydrator.tsx
git commit -m "feat(phase-0): seed mock users, books, posts"
```

---

### Task 0.6: 共用 UI 元件（Button、Modal、Input、PageContainer）

**Files:**
- Create: `components/ui/Button.tsx`、`components/ui/Modal.tsx`、`components/ui/Input.tsx`、`components/ui/Textarea.tsx`、`components/ui/PageContainer.tsx`

- [ ] **Step 1: Button**

Create `components/ui/Button.tsx`:

```tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  children: ReactNode;
};

export default function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        "w-full py-4 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-sage text-cream hover:bg-sage-dark",
        variant === "ghost" && "text-walnut hover:bg-cream",
        variant === "outline" && "border border-tag text-walnut hover:bg-cream",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

(安裝 clsx：`npm install clsx`)

- [ ] **Step 2: Modal**

Create `components/ui/Modal.tsx`:

```tsx
"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, children }: { open: boolean; onClose?: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-walnut/40 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-cream rounded-2xl w-full max-w-[420px] p-6 shadow-xl"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Input、Textarea、PageContainer**

Create `components/ui/Input.tsx`:

```tsx
import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export default function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full px-4 py-3 rounded-xl bg-cream border border-tag/40 text-walnut",
        "focus:outline-none focus:border-sage transition-colors",
        className
      )}
      {...rest}
    />
  );
}
```

Create `components/ui/Textarea.tsx`:

```tsx
import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export default function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full px-4 py-3 rounded-xl bg-cream border border-tag/40 text-walnut",
        "focus:outline-none focus:border-sage transition-colors min-h-[100px] resize-none",
        className
      )}
      {...rest}
    />
  );
}
```

Create `components/ui/PageContainer.tsx`:

```tsx
import { ReactNode } from "react";

export default function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`min-h-screen px-6 py-8 ${className}`}>{children}</main>;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui package.json package-lock.json
git commit -m "feat(phase-0): add base UI primitives (Button/Modal/Input/Textarea/PageContainer)"
```

---

# Phase 1: Welcome + Onboarding

### Task 1.1: Welcome 頁（第 1 頁）

**Files:**
- Create: `app/(onboarding)/layout.tsx`、`app/(onboarding)/welcome/page.tsx`、`components/onboarding/PageDots.tsx`
- Asset: 把使用者提供的水彩圖存到 `public/illustrations/welcome.png`

- [ ] **Step 1: PageDots 元件**

Create `components/onboarding/PageDots.tsx`:

```tsx
import clsx from "clsx";

export default function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={clsx("w-2 h-2 rounded-full transition-colors",
          i === current ? "bg-sage" : "bg-tag/40")} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Onboarding layout**

Create `app/(onboarding)/layout.tsx`:

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Welcome page**

Create `app/(onboarding)/welcome/page.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageDots from "@/components/onboarding/PageDots";

export default function Welcome() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <Image src="/illustrations/welcome.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/0 via-parchment/0 to-parchment" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-3xl text-walnut">歡迎來到</h2>
          <h1 className="font-display text-7xl text-walnut mt-2 tracking-wide">Folio</h1>
          <p className="mt-6 text-walnut-soft text-lg leading-relaxed">在書頁之間，<br/>遇見懂你的靈魂。</p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-2">
        <PageDots total={4} current={0} />
        <div className="mt-6">
          <Link href="/intro/2"><Button>開始旅程</Button></Link>
          <div className="mt-3 text-center text-walnut-soft text-sm">
            已有帳號？<Link href="/auth" className="underline">登入</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Root redirect 到 welcome**

修改 `app/page.tsx`：

```tsx
import { redirect } from "next/navigation";
export default function Root() { redirect("/welcome"); }
```

- [ ] **Step 5: 手動驗證 + commit**

跑 `npm run dev`，瀏覽 `localhost:3000` → 應該看到 welcome screen。
若還沒有 `welcome.png`，先放 placeholder 圖（任何 PNG，後續再換）。

```bash
git add app components/onboarding/PageDots.tsx public/illustrations
git commit -m "feat(phase-1): add Welcome screen as page 1"
```

---

### Task 1.2: Onboarding 第 2-4 頁

**Files:**
- Create: `app/(onboarding)/intro/[step]/page.tsx`、`lib/onboarding-content.ts`
- Asset 占位：`public/illustrations/intro-2.png`、`intro-3.png`、`intro-4.png`

- [ ] **Step 1: 內容資料**

Create `lib/onboarding-content.ts`:

```ts
export const ONBOARDING = [
  { step: 2, image: "/illustrations/intro-2.png", title: "以書識人", body: "用一本書代表你自己。\n讓對的人從你的書架走向你。" },
  { step: 3, image: "/illustrations/intro-3.png", title: "共讀夥伴", body: "找到讀同一本書的人，\n從相同的字句開始一段故事。" },
  { step: 4, image: "/illustrations/intro-4.png", title: "個人書房", body: "想自己讀也很好。\n寫下進度與心得，留給未來的自己。" },
];
```

- [ ] **Step 2: Intro page**

Create `app/(onboarding)/intro/[step]/page.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import PageDots from "@/components/onboarding/PageDots";
import { ONBOARDING } from "@/lib/onboarding-content";

export default async function Intro({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const item = ONBOARDING.find((o) => String(o.step) === step);
  if (!item) notFound();

  const next = item.step < 4 ? `/intro/${item.step + 1}` : "/auth";
  const nextLabel = item.step < 4 ? "繼續" : "開始註冊";

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <Image src={item.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/0 via-parchment/0 to-parchment" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center">
          <h1 className="font-display text-5xl text-walnut">{item.title}</h1>
          <p className="mt-4 text-walnut-soft text-lg leading-relaxed whitespace-pre-line">{item.body}</p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-2">
        <PageDots total={4} current={item.step - 1} />
        <div className="mt-6 space-y-3">
          <Link href={next}><Button>{nextLabel}</Button></Link>
          {item.step < 4 && (
            <Link href="/auth"><Button variant="ghost">略過</Button></Link>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app lib/onboarding-content.ts public/illustrations
git commit -m "feat(phase-1): add onboarding pages 2-4"
```

---

# Phase 2: Auth (mocked)

### Task 2.1: 登入頁

**Files:**
- Create: `app/(onboarding)/auth/page.tsx`、`components/onboarding/SocialButton.tsx`

- [ ] **Step 1: SocialButton**

Create `components/onboarding/SocialButton.tsx`:

```tsx
import { ReactNode } from "react";
import clsx from "clsx";

export default function SocialButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full py-4 rounded-full bg-cream border border-tag/60 flex items-center justify-center gap-3 text-walnut hover:bg-tag/10 transition-colors">
      {icon}
      <span>{label}</span>
    </button>
  );
}
```

- [ ] **Step 2: Auth page**

Create `app/(onboarding)/auth/page.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import SocialButton from "@/components/onboarding/SocialButton";

export default function Auth() {
  const router = useRouter();
  const setCurrentUser = useFolioStore((s) => s.setCurrentUser);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const startNewUser = () => {
    const id = `user-${Date.now()}`;
    upsertUser({
      id, nickname: "", gender: "", age: 0,
      bookCategories: [], qaAnswers: {},
      stance: "純粹書友",
      stanceChangedAt: 0, nicknameChangedAt: 0,
    });
    setCurrentUser(id);
    router.push("/register/basic");
  };

  const useDemoUser = () => {
    setCurrentUser("alice");
    router.push("/discover");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-4">
      <h1 className="font-display text-5xl text-walnut mb-2">Folio</h1>
      <p className="text-walnut-soft mb-8 text-center">登入以開始你的閱讀旅程</p>

      <div className="w-full space-y-3">
        <SocialButton icon={<span></span>} label="使用 Google 登入" onClick={startNewUser} />
        <SocialButton icon={<span></span>} label="使用 Apple 登入"  onClick={startNewUser} />
        <button onClick={useDemoUser}
          className="w-full text-walnut-soft text-sm underline pt-4">以「Alice」 demo 帳號繼續</button>
      </div>
    </main>
  );
}
```

> 設計說明：因 demo 不接真實 OAuth，按 Google/Apple 都跑 mock 註冊；多一個「Alice demo 帳號」讓內測者快速跳到主畫面看 mock posts。

- [ ] **Step 3: Commit**

```bash
git add app/\(onboarding\)/auth components/onboarding/SocialButton.tsx
git commit -m "feat(phase-2): mock auth screen with two paths"
```

---

# Phase 3: Registration

### Task 3.1: Step 1.2-A 基本資料

**Files:**
- Create: `app/register/layout.tsx`、`app/register/basic/page.tsx`、`components/shared/RegisterStepper.tsx`、`lib/book-categories.ts`

- [ ] **Step 1: 預設書類**

Create `lib/book-categories.ts`:

```ts
export const PRESET_CATEGORIES = ["小說","散文","詩集","哲學","心理","商業","科技","歷史","傳記","推理","奇幻","科普"];
```

- [ ] **Step 2: Stepper**

Create `components/shared/RegisterStepper.tsx`:

```tsx
import clsx from "clsx";
const STEPS = ["基本", "問答", "心態", "確認"];
export default function RegisterStepper({ current }: { current: 0|1|2|3 }) {
  return (
    <div className="flex items-center gap-2 text-xs text-walnut-soft mb-8">
      {STEPS.map((s, i) => (
        <span key={s} className={clsx("flex items-center gap-2", i === current && "text-sage font-medium")}>
          <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center",
            i === current ? "bg-sage text-cream" : "bg-tag/30")}>{i+1}</span>
          {s}
          {i < STEPS.length - 1 && <span className="text-tag">→</span>}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Register layout**

Create `app/register/layout.tsx`:

```tsx
import PageContainer from "@/components/ui/PageContainer";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}
```

- [ ] **Step 4: Basic page**

Create `app/register/basic/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import { PRESET_CATEGORIES } from "@/lib/book-categories";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import clsx from "clsx";

export default function BasicPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const upsertUser = useFolioStore((s) => s.upsertUser);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [age, setAge] = useState(user?.age || 0);
  const [categories, setCategories] = useState<string[]>(user?.bookCategories ?? []);
  const [customCat, setCustomCat] = useState("");

  const toggleCat = (c: string) => {
    setCategories((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : (cs.length >= 5 ? cs : [...cs, c]));
  };

  const addCustom = () => {
    const trimmed = customCat.trim();
    if (!trimmed || categories.length >= 5 || categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
    setCustomCat("");
  };

  const valid = nickname.trim() && gender && age > 0 && categories.length > 0;

  const next = () => {
    if (!user || !valid) return;
    upsertUser({ ...user, nickname: nickname.trim(), gender, age, bookCategories: categories });
    router.push("/register/qa");
  };

  return (
    <>
      <RegisterStepper current={0} />
      <h1 className="font-display text-3xl text-walnut mb-6">先讓我們認識你</h1>

      <label className="text-walnut-soft text-sm">暱稱</label>
      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut-soft text-sm">性別</label>
      <div className="grid grid-cols-3 gap-2 my-2 mb-5">
        {["女","男","其他"].map((g) => (
          <button key={g} onClick={() => setGender(g)} className={clsx(
            "py-3 rounded-xl border transition-colors",
            gender === g ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{g}</button>
        ))}
      </div>

      <label className="text-walnut-soft text-sm">年齡</label>
      <Input type="number" min={1} max={120} value={age || ""} onChange={(e) => setAge(parseInt(e.target.value || "0"))} className="mb-5 mt-1" />

      <label className="text-walnut-soft text-sm">喜歡的書籍種類（最多 5 個）</label>
      <div className="flex flex-wrap gap-2 my-2">
        {PRESET_CATEGORIES.map((c) => (
          <button key={c} onClick={() => toggleCat(c)} className={clsx(
            "px-3 py-1.5 rounded-full border text-sm transition-colors",
            categories.includes(c) ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        <Input value={customCat} onChange={(e) => setCustomCat(e.target.value)} placeholder="自訂類別" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
      <p className="text-xs text-walnut-soft -mt-6 mb-6">已選 {categories.length} / 5</p>

      <Button onClick={next} disabled={!valid}>下一步</Button>
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/register/basic app/register/layout.tsx components/shared/RegisterStepper.tsx lib/book-categories.ts
git commit -m "feat(phase-3): registration step 1 - basic info"
```

---

### Task 3.2: Step 1.2-B 個性問答

**Files:**
- Create: `app/register/qa/page.tsx`

- [ ] **Step 1: QA Page**

Create `app/register/qa/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import clsx from "clsx";

const HOURS = ["<1", "1-3", "3-7", "7-14", "14+"] as const;

export default function QAPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [defining,    setDefining]    = useState(user?.qaAnswers.defining ?? "");
  const [titleOfLife, setTitleOfLife] = useState(user?.qaAnswers.titleOfMyLife ?? "");
  const [hours,       setHours]       = useState(user?.qaAnswers.readingHours);

  const answeredCount =
    (defining.trim() ? 1 : 0) + (titleOfLife.trim() ? 1 : 0) + (hours ? 1 : 0);
  const valid = answeredCount >= 1;

  const save = (skipAll = false) => {
    if (!user) return;
    upsertUser({
      ...user,
      qaAnswers: skipAll ? {} : {
        defining: defining.trim() || undefined,
        titleOfMyLife: titleOfLife.trim() || undefined,
        readingHours: hours,
      },
    });
    router.push("/register/stance");
  };

  return (
    <>
      <RegisterStepper current={1} />
      <h1 className="font-display text-3xl text-walnut mb-2">關於你和書</h1>
      <p className="text-walnut-soft text-sm mb-6">至少答 1 題，最多答 3 題；可以全跳過、之後在我的頁面補。</p>

      <label className="text-walnut text-sm">哪一本書最能形容你自己，為什麼？</label>
      <Textarea value={defining} onChange={(e) => setDefining(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut text-sm">如果你的人生是一本書，書名會叫什麼？</label>
      <Input value={titleOfLife} onChange={(e) => setTitleOfLife(e.target.value)} className="mb-5 mt-1" />

      <label className="text-walnut text-sm">每週花多少時間在看書？</label>
      <div className="grid grid-cols-5 gap-2 mt-2 mb-8">
        {HOURS.map((h) => (
          <button key={h} onClick={() => setHours(hours === h ? undefined : h)} className={clsx(
            "py-2 rounded-xl border text-sm transition-colors",
            hours === h ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut")}>{h}</button>
        ))}
      </div>

      <div className="space-y-3">
        <Button onClick={() => save(false)} disabled={!valid}>下一步</Button>
        <Button variant="ghost" onClick={() => save(true)}>全部跳過</Button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/register/qa
git commit -m "feat(phase-3): registration step 2 - personality QA"
```

---

### Task 3.3: Step 1.3 心態選擇

**Files:**
- Create: `app/register/stance/page.tsx`、`lib/stance-meta.ts`

- [ ] **Step 1: 心態 metadata**

Create `lib/stance-meta.ts`:

```ts
import type { Stance } from "./store";

export const STANCE_META: Record<Stance, { label: string; sub: string }> = {
  "純粹書友":     { label: "純粹書友",     sub: "想找一起讀書的朋友，不想多" },
  "純粹找緣分":   { label: "純粹找緣分",   sub: "想以書為媒，認識更深的關係" },
  "不拘":         { label: "不拘",         sub: "都好，看跟誰讀什麼書"     },
};
```

- [ ] **Step 2: Stance Page**

Create `app/register/stance/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Button from "@/components/ui/Button";
import { STANCE_META } from "@/lib/stance-meta";
import type { Stance } from "@/lib/store";
import clsx from "clsx";

export default function StancePage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [stance, setStance] = useState<Stance>(user?.stance ?? "純粹書友");

  const next = () => {
    if (!user) return;
    upsertUser({ ...user, stance, stanceChangedAt: Date.now() });
    router.push("/register/confirm");
  };

  return (
    <>
      <RegisterStepper current={2} />
      <h1 className="font-display text-3xl text-walnut mb-2">你抱持的心態</h1>
      <p className="text-walnut-soft text-sm mb-6">這會決定你看到誰、誰看到你。之後可改、有 7 天冷卻。</p>

      <div className="space-y-3">
        {(Object.entries(STANCE_META) as [Stance, typeof STANCE_META[Stance]][]).map(([key, m]) => (
          <button key={key} onClick={() => setStance(key)} className={clsx(
            "w-full text-left p-5 rounded-2xl border-2 transition-colors",
            stance === key ? "border-sage bg-sage/10" : "border-tag/30 bg-cream")}>
            <div className="font-medium text-walnut">{m.label}</div>
            <div className="text-walnut-soft text-sm mt-1">{m.sub}</div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={next}>下一步</Button>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/register/stance lib/stance-meta.ts
git commit -m "feat(phase-3): registration step 3 - stance selection"
```

---

### Task 3.4: Step 1.4 確認 modal + 完成註冊

**Files:**
- Create: `app/register/confirm/page.tsx`

- [ ] **Step 1: Confirm page**

Create `app/register/confirm/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import RegisterStepper from "@/components/shared/RegisterStepper";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ConfirmPage() {
  const router = useRouter();
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const finalize = () => {
    setOpen(false);
    router.push("/discover");
  };

  return (
    <>
      <RegisterStepper current={3} />
      <h1 className="font-display text-3xl text-walnut mb-6">確認你的資料</h1>

      <dl className="space-y-3 text-walnut">
        <Row k="暱稱"   v={user.nickname} />
        <Row k="性別"   v={user.gender} />
        <Row k="年齡"   v={String(user.age)} />
        <Row k="書籍種類" v={user.bookCategories.join("、")} />
        <Row k="心態"   v={user.stance} />
      </dl>

      <div className="mt-10">
        <Button onClick={() => setOpen(true)}>確認送出</Button>
      </div>

      <Modal open={open}>
        <h3 className="font-display text-xl text-walnut">⚠️ 確認無誤嗎？</h3>
        <p className="text-walnut-soft text-sm mt-3 leading-relaxed">
          以下資料註冊後將無法直接更改：<br/>
          <span className="text-walnut font-medium">性別、年齡</span><br/>
          如需更改、需提交審核（之後在「我的頁面」操作）。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>回上一步</Button>
          <Button onClick={finalize}>確認送出</Button>
        </div>
      </Modal>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-tag/30 pb-2">
      <dt className="text-walnut-soft">{k}</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/register/confirm
git commit -m "feat(phase-3): registration step 4 - confirm modal"
```

---

# Phase 4: Main Layout + Profile (我的頁面)

### Task 4.1: 主畫面 layout（底部 nav）

**Files:**
- Create: `app/(main)/layout.tsx`、`components/shared/BottomNav.tsx`

- [ ] **Step 1: BottomNav**

Create `components/shared/BottomNav.tsx`:

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Library, User } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/discover", label: "探索", Icon: Compass },
  { href: "/shelf",    label: "書櫃", Icon: Library },
  { href: "/me",       label: "我",   Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto bg-cream/95 backdrop-blur border-t border-tag/30 grid grid-cols-3 py-2">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={clsx(
          "flex flex-col items-center py-2 text-xs gap-1",
          pathname.startsWith(href) ? "text-sage" : "text-walnut-soft")}>
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Main layout**

Create `app/(main)/layout.tsx`:

```tsx
import BottomNav from "@/components/shared/BottomNav";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pb-24">{children}</div>
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/layout.tsx components/shared/BottomNav.tsx
git commit -m "feat(phase-4): main layout with bottom nav"
```

---

### Task 4.2: 冷卻邏輯 + 測試

**Files:**
- Create: `lib/cooldown.ts`、`tests/lib/cooldown.test.ts`

- [ ] **Step 1: 寫測試**

Create `tests/lib/cooldown.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cooldownRemainingMs, isOnCooldown } from "@/lib/cooldown";

const DAY = 86_400_000;

describe("cooldown", () => {
  it("returns 0 when never set", () => {
    expect(cooldownRemainingMs(0, 7, Date.now())).toBe(0);
  });

  it("returns full window when just set", () => {
    const now = 1_000_000_000;
    expect(cooldownRemainingMs(now, 7, now)).toBe(7 * DAY);
  });

  it("returns 0 after window has passed", () => {
    const now = 1_000_000_000;
    expect(cooldownRemainingMs(now - 8 * DAY, 7, now)).toBe(0);
  });

  it("isOnCooldown true within window", () => {
    const now = 1_000_000_000;
    expect(isOnCooldown(now - 3 * DAY, 7, now)).toBe(true);
  });

  it("isOnCooldown false past window", () => {
    const now = 1_000_000_000;
    expect(isOnCooldown(now - 8 * DAY, 7, now)).toBe(false);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test -- --run cooldown`
Expected: FAIL — module 不存在

- [ ] **Step 3: 寫 cooldown.ts**

```ts
// lib/cooldown.ts
const DAY = 86_400_000;

export function cooldownRemainingMs(lastChangedAt: number, days: number, now = Date.now()) {
  if (lastChangedAt <= 0) return 0;
  const end = lastChangedAt + days * DAY;
  return Math.max(0, end - now);
}

export function isOnCooldown(lastChangedAt: number, days: number, now = Date.now()) {
  return cooldownRemainingMs(lastChangedAt, days, now) > 0;
}

export function formatRemainingDays(ms: number): string {
  const days = Math.ceil(ms / DAY);
  return `剩 ${days} 天`;
}
```

- [ ] **Step 4: 跑測試 + commit**

```bash
npm test -- --run cooldown
git add lib/cooldown.ts tests/lib/cooldown.test.ts
git commit -m "feat(phase-4): cooldown utility with tests"
```

---

### Task 4.3: 我的頁面（讀模式 + 編輯）

**Files:**
- Create: `app/(main)/me/page.tsx`、`components/me/EditFieldModal.tsx`

- [ ] **Step 1: EditFieldModal**

Create `components/me/EditFieldModal.tsx`:

```tsx
"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function EditFieldModal({
  open, onClose, label, initial, onSave, cooldownMessage,
}: {
  open: boolean; onClose: () => void; label: string; initial: string;
  onSave: (next: string) => void; cooldownMessage?: string;
}) {
  const [val, setVal] = useState(initial);
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯 {label}</h3>
      {cooldownMessage && <p className="text-amber-700 text-sm mt-2">⚠️ {cooldownMessage}</p>}
      <Input value={val} onChange={(e) => setVal(e.target.value)} className="mt-4" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(val); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Me page**

Create `app/(main)/me/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import { isOnCooldown, cooldownRemainingMs, formatRemainingDays } from "@/lib/cooldown";
import { STANCE_META } from "@/lib/stance-meta";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import EditFieldModal from "@/components/me/EditFieldModal";
import Modal from "@/components/ui/Modal";
import type { Stance } from "@/lib/store";
import clsx from "clsx";

export default function MePage() {
  const userId = useFolioStore((s) => s.currentUserId);
  const user = useFolioStore((s) => userId ? s.users[userId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const [editing, setEditing] = useState<null | "nickname" | "categories" | "qa">(null);
  const [stanceModal, setStanceModal] = useState(false);

  if (!user) return null;

  const nickCooldownLeft = cooldownRemainingMs(user.nicknameChangedAt, 30);
  const stanceCooldownLeft = cooldownRemainingMs(user.stanceChangedAt, 7);

  const setStance = (next: Stance) => {
    if (next === user.stance) { setStanceModal(false); return; }
    upsertUser({ ...user, stance: next, stanceChangedAt: Date.now() });
    setStanceModal(false);
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">我</h1>

      <Section label="暱稱" value={user.nickname}
        rightAction={<button onClick={() => setEditing("nickname")} disabled={nickCooldownLeft > 0}
          className={clsx("text-sm", nickCooldownLeft > 0 ? "text-walnut-soft" : "text-sage")}>
          {nickCooldownLeft > 0 ? formatRemainingDays(nickCooldownLeft) : "編輯"}
        </button>} />

      <Section label="性別 / 年齡" value={`${user.gender} ・ ${user.age}`}
        rightAction={<button className="text-sm text-walnut-soft underline">需審核才能改</button>} />

      <Section label="書籍種類" value={user.bookCategories.join("、")}
        rightAction={<button onClick={() => setEditing("categories")} className="text-sm text-sage">編輯</button>} />

      <Section label="個性問答" value={
        [user.qaAnswers.defining, user.qaAnswers.titleOfMyLife, user.qaAnswers.readingHours]
          .filter(Boolean).join(" / ") || "尚未填寫"
      } rightAction={<button onClick={() => setEditing("qa")} className="text-sm text-sage">編輯</button>} />

      <Section label="抱持的心態" value={user.stance}
        rightAction={<button onClick={() => setStanceModal(true)} disabled={stanceCooldownLeft > 0}
          className={clsx("text-sm", stanceCooldownLeft > 0 ? "text-walnut-soft" : "text-sage")}>
          {stanceCooldownLeft > 0 ? formatRemainingDays(stanceCooldownLeft) : "更換"}
        </button>} />

      <EditFieldModal open={editing === "nickname"} onClose={() => setEditing(null)}
        label="暱稱" initial={user.nickname}
        cooldownMessage="更換後將進入 30 天冷卻"
        onSave={(v) => upsertUser({ ...user, nickname: v.trim() || user.nickname, nicknameChangedAt: Date.now() })} />

      {/* Categories / QA edit modals 留 placeholder，下個 task 補完 */}

      <Modal open={stanceModal} onClose={() => setStanceModal(false)}>
        <h3 className="font-display text-xl text-walnut">更換心態</h3>
        <p className="text-amber-700 text-sm mt-2">⚠️ 更換後將進入 7 天冷卻、期間無法再變更。</p>
        <div className="space-y-2 mt-4">
          {(Object.keys(STANCE_META) as Stance[]).map((s) => (
            <button key={s} onClick={() => setStance(s)} className={clsx(
              "w-full p-3 rounded-xl border text-left",
              user.stance === s ? "border-sage bg-sage/10" : "border-tag/30")}>
              <div className="font-medium">{STANCE_META[s].label}</div>
              <div className="text-walnut-soft text-sm">{STANCE_META[s].sub}</div>
            </button>
          ))}
        </div>
      </Modal>
    </PageContainer>
  );
}

function Section({ label, value, rightAction }: { label: string; value: string; rightAction: React.ReactNode }) {
  return (
    <div className="border-b border-tag/30 py-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-walnut-soft text-xs">{label}</div>
          <div className="text-walnut mt-1">{value}</div>
        </div>
        <div>{rightAction}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/me components/me
git commit -m "feat(phase-4): profile page with cooldown-aware edits"
```

---

### Task 4.4: 個性問答編輯 modal + 書籍種類編輯 modal

**Files:**
- Create: `components/me/EditCategoriesModal.tsx`、`components/me/EditQAModal.tsx`
- Modify: `app/(main)/me/page.tsx` 把 placeholder 換成這兩個元件

- [ ] **Step 1: EditCategoriesModal**

```tsx
// components/me/EditCategoriesModal.tsx
"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { PRESET_CATEGORIES } from "@/lib/book-categories";
import clsx from "clsx";

export default function EditCategoriesModal({ open, onClose, initial, onSave }:
  { open: boolean; onClose: () => void; initial: string[]; onSave: (cs: string[]) => void; }
) {
  const [cats, setCats] = useState<string[]>(initial);
  const [custom, setCustom] = useState("");
  const toggle = (c: string) => setCats((cs) =>
    cs.includes(c) ? cs.filter((x) => x !== c) : (cs.length >= 5 ? cs : [...cs, c])
  );
  const addCustom = () => {
    const t = custom.trim();
    if (!t || cats.length >= 5 || cats.includes(t)) return;
    setCats([...cats, t]); setCustom("");
  };
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯書籍種類</h3>
      <div className="flex flex-wrap gap-2 mt-3">
        {PRESET_CATEGORIES.map((c) => (
          <button key={c} onClick={() => toggle(c)}
            className={clsx("px-3 py-1.5 rounded-full border text-sm",
              cats.includes(c) ? "border-sage bg-sage text-cream" : "border-tag/40")}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="自訂類別" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
      <p className="text-xs text-walnut-soft mt-2">已選 {cats.length} / 5</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onSave(cats); onClose(); }}>儲存</Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: EditQAModal**

```tsx
// components/me/EditQAModal.tsx
"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { ReadingMins } from "@/lib/store";
import clsx from "clsx";

const HOURS: ReadingMins[] = ["<1","1-3","3-7","7-14","14+"];

export default function EditQAModal({ open, onClose, initial, onSave }:
  { open: boolean; onClose: () => void;
    initial: { defining?: string; titleOfMyLife?: string; readingHours?: ReadingMins };
    onSave: (q: { defining?: string; titleOfMyLife?: string; readingHours?: ReadingMins }) => void; }
) {
  const [d, setD] = useState(initial.defining ?? "");
  const [t, setT] = useState(initial.titleOfMyLife ?? "");
  const [h, setH] = useState<ReadingMins | undefined>(initial.readingHours);

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="font-display text-xl text-walnut">編輯個性問答</h3>
      <p className="text-walnut-soft text-sm mt-1">三題自由增 / 改 / 清空</p>

      <label className="text-walnut text-sm mt-4 block">最能形容你的書？為什麼？</label>
      <Textarea value={d} onChange={(e) => setD(e.target.value)} className="mt-1" />

      <label className="text-walnut text-sm mt-4 block">人生若是一本書，書名？</label>
      <Input value={t} onChange={(e) => setT(e.target.value)} className="mt-1" />

      <label className="text-walnut text-sm mt-4 block">每週看書時數</label>
      <div className="grid grid-cols-5 gap-2 mt-1 mb-2">
        {HOURS.map((opt) => (
          <button key={opt} onClick={() => setH(h === opt ? undefined : opt)}
            className={clsx("py-2 rounded-xl border text-sm",
              h === opt ? "border-sage bg-sage text-cream" : "border-tag/40")}>{opt}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => onSave({ defining: d.trim() || undefined, titleOfMyLife: t.trim() || undefined, readingHours: h })}>儲存</Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: 串到 me/page.tsx**

修改 `app/(main)/me/page.tsx`，在最末段（stanceModal 之前）加：

```tsx
<EditCategoriesModal open={editing === "categories"} onClose={() => setEditing(null)}
  initial={user.bookCategories}
  onSave={(cats) => upsertUser({ ...user, bookCategories: cats })} />
<EditQAModal open={editing === "qa"} onClose={() => setEditing(null)}
  initial={user.qaAnswers}
  onSave={(qa) => { upsertUser({ ...user, qaAnswers: qa }); setEditing(null); }} />
```

並加 import。

- [ ] **Step 4: Commit**

```bash
git add components/me/EditCategoriesModal.tsx components/me/EditQAModal.tsx app/\(main\)/me/page.tsx
git commit -m "feat(phase-4): edit modals for categories and QA"
```

---

# Phase 5: Discovery / Feed

### Task 5.1: 心態過濾矩陣（lib/filters）+ 測試

**Files:**
- Create: `lib/filters.ts`、`tests/lib/filters.test.ts`

- [ ] **Step 1: 寫測試**

```ts
// tests/lib/filters.test.ts
import { describe, it, expect } from "vitest";
import { canSeeEachOther } from "@/lib/filters";

describe("filter matrix", () => {
  it("純粹書友 ↔ 純粹書友 互看", () => {
    expect(canSeeEachOther("純粹書友", "純粹書友")).toBe(true);
  });
  it("純粹書友 ↔ 純粹找緣分 互不可見", () => {
    expect(canSeeEachOther("純粹書友", "純粹找緣分")).toBe(false);
    expect(canSeeEachOther("純粹找緣分", "純粹書友")).toBe(false);
  });
  it("不拘 對 任何人 都互看", () => {
    expect(canSeeEachOther("不拘", "純粹書友")).toBe(true);
    expect(canSeeEachOther("不拘", "純粹找緣分")).toBe(true);
    expect(canSeeEachOther("不拘", "不拘")).toBe(true);
  });
});
```

- [ ] **Step 2: Run + Fail**

Run: `npm test -- --run filters`
Expected: FAIL

- [ ] **Step 3: 寫 filters.ts**

```ts
// lib/filters.ts
import type { Stance } from "./store";

export function canSeeEachOther(a: Stance, b: Stance): boolean {
  if (a === "不拘" || b === "不拘") return true;
  return a === b;
}
```

- [ ] **Step 4: Commit**

```bash
npm test -- --run filters
git add lib/filters.ts tests/lib/filters.test.ts
git commit -m "feat(phase-5): stance filter matrix with tests"
```

---

### Task 5.2: 探索 feed 頁

**Files:**
- Create: `app/(main)/discover/page.tsx`、`components/feed/PostCard.tsx`、`components/feed/StanceBadge.tsx`

- [ ] **Step 1: StanceBadge**

```tsx
// components/feed/StanceBadge.tsx
import type { Stance } from "@/lib/store";
import clsx from "clsx";

const TONE: Record<Stance, string> = {
  "純粹書友":     "bg-sage/20 text-sage",
  "純粹找緣分":   "bg-amber-200/40 text-amber-800",
  "不拘":         "bg-tag/30 text-walnut",
};

export default function StanceBadge({ stance }: { stance: Stance }) {
  return <span className={clsx("text-[11px] px-2 py-0.5 rounded-full", TONE[stance])}>{stance}</span>;
}
```

- [ ] **Step 2: PostCard**

```tsx
// components/feed/PostCard.tsx
import Link from "next/link";
import { useFolioStore } from "@/lib/store";
import StanceBadge from "./StanceBadge";

export default function PostCard({ postId }: { postId: string }) {
  const post  = useFolioStore((s) => s.posts[postId]);
  const owner = useFolioStore((s) => post && s.users[post.ownerId]);
  const book  = useFolioStore((s) => post && s.books[post.bookId]);
  if (!post || !owner || !book) return null;

  return (
    <Link href={`/discover/post/${post.id}`}
      className="block p-5 rounded-2xl bg-cream border border-tag/30 hover:border-sage transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="font-display text-xl text-walnut">{book.title}</div>
          <div className="text-walnut-soft text-sm mt-1">{owner.nickname} ・ 目前 {post.progressAtPost}%</div>
        </div>
        <StanceBadge stance={owner.stance} />
      </div>
      <p className="text-walnut text-sm mt-3 line-clamp-2">{post.whyRead}</p>
      <div className="text-walnut-soft text-xs mt-3">期待 {post.expectedWeeks} 週讀完</div>
    </Link>
  );
}
```

- [ ] **Step 3: Discover page**

```tsx
// app/(main)/discover/page.tsx
"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useFolioStore } from "@/lib/store";
import { canSeeEachOther } from "@/lib/filters";
import PageContainer from "@/components/ui/PageContainer";
import PostCard from "@/components/feed/PostCard";

export default function Discover() {
  const userId = useFolioStore((s) => s.currentUserId);
  const me     = useFolioStore((s) => userId ? s.users[userId] : null);
  const posts  = useFolioStore((s) => s.posts);
  const users  = useFolioStore((s) => s.users);

  if (!me) return null;

  const visible = Object.values(posts)
    .filter((p) => p.status === "open" && p.ownerId !== me.id)
    .filter((p) => {
      const owner = users[p.ownerId];
      return owner && canSeeEachOther(me.stance, owner.stance);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">探索</h1>
        <Link href="/discover/new" className="flex items-center gap-1 text-sage">
          <Plus size={18} /> 發帖
        </Link>
      </div>

      {visible.length === 0 && (
        <div className="text-walnut-soft text-center mt-16">
          目前沒有符合的貼文。<br/>試試發一篇？
        </div>
      )}

      <div className="space-y-3">
        {visible.map((p) => <PostCard key={p.id} postId={p.id} />)}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/discover/page.tsx components/feed
git commit -m "feat(phase-5): discover feed with stance filtering"
```

---

### Task 5.3: Post 詳細頁

**Files:**
- Create: `app/(main)/discover/post/[id]/page.tsx`

- [ ] **Step 1: Post detail**

```tsx
// app/(main)/discover/post/[id]/page.tsx
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StanceBadge from "@/components/feed/StanceBadge";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post  = useFolioStore((s) => s.posts[id]);
  const owner = useFolioStore((s) => post && s.users[post.ownerId]);
  const book  = useFolioStore((s) => post && s.books[post.bookId]);
  const meId  = useFolioStore((s) => s.currentUserId);

  if (!post || !owner || !book) return null;
  const isMine = meId === post.ownerId;

  return (
    <PageContainer>
      <Link href="/discover" className="text-sage text-sm">← 回探索</Link>
      <div className="mt-4 flex justify-between items-start">
        <h1 className="font-display text-3xl text-walnut">{book.title}</h1>
        <StanceBadge stance={owner.stance} />
      </div>
      <div className="text-walnut-soft text-sm mt-1">{owner.nickname} ・ 目前 {post.progressAtPost}%</div>

      <Field label="為什麼想讀">{post.whyRead}</Field>
      <Field label="期待對方">{post.partnerExpectation}</Field>
      <Field label="預期週數">{post.expectedWeeks} 週</Field>

      {!isMine ? (
        <div className="mt-8">
          <Link href={`/apply/${post.id}`}><Button>我要申請</Button></Link>
        </div>
      ) : (
        <div className="mt-8">
          <Link href={`/discover/post/${post.id}/applicants`}><Button>查看申請者</Button></Link>
        </div>
      )}
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-walnut-soft text-xs">{label}</div>
      <div className="text-walnut mt-1 leading-relaxed">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/discover/post
git commit -m "feat(phase-5): post detail page"
```

---

# Phase 6: Post + Apply

### Task 6.1: 發 Post 表單

**Files:**
- Create: `app/(main)/discover/new/page.tsx`、`components/shared/ProgressSlider.tsx`、`components/shared/BookPicker.tsx`

- [ ] **Step 1: ProgressSlider**

```tsx
// components/shared/ProgressSlider.tsx
"use client";
export default function ProgressSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-sage" />
        <span className="font-display text-2xl text-sage w-14 text-right">{value}%</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: BookPicker**（簡化：用下拉選 mock 書庫 + 自訂）

```tsx
// components/shared/BookPicker.tsx
"use client";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import Input from "@/components/ui/Input";

export default function BookPicker({ value, onChange }: { value: string; onChange: (bookId: string) => void; }) {
  const books = useFolioStore((s) => s.books);
  const upsertBook = useFolioStore((s) => s.upsertBook);
  const [custom, setCustom] = useState("");

  const addCustom = () => {
    const t = custom.trim();
    if (!t) return;
    const id = `b-${Date.now()}`;
    upsertBook({ id, title: t });
    onChange(id);
    setCustom("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.values(books).map((b) => (
          <button key={b.id} onClick={() => onChange(b.id)}
            className={`px-3 py-1.5 rounded-full text-sm border ${value === b.id ? "border-sage bg-sage text-cream" : "border-tag/40 text-walnut"}`}>
            {b.title}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="或輸入書名" />
        <button onClick={addCustom} className="px-4 rounded-xl border border-tag/40 text-sage">＋</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: New post page**

```tsx
// app/(main)/discover/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import BookPicker from "@/components/shared/BookPicker";
import ProgressSlider from "@/components/shared/ProgressSlider";

const WEEKS = [2, 4, 6, 8, 12];

export default function NewPost() {
  const router = useRouter();
  const meId = useFolioStore((s) => s.currentUserId);
  const upsertPost = useFolioStore((s) => s.upsertPost);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);

  const [bookId, setBookId] = useState("");
  const [progress, setProgress] = useState(0);
  const [whyRead, setWhyRead] = useState("");
  const [partnerExpectation, setPartner] = useState("");
  const [weeks, setWeeks] = useState(4);

  const valid = bookId && whyRead.trim() && partnerExpectation.trim();

  const submit = () => {
    if (!meId || !valid) return;
    const id = `p-${Date.now()}`;
    upsertPost({
      id, ownerId: meId, bookId, progressAtPost: progress, whyRead: whyRead.trim(),
      partnerExpectation: partnerExpectation.trim(), expectedWeeks: weeks,
      status: "open", createdAt: Date.now(),
    });
    upsertProgress({ userId: meId, bookId, percent: progress, updatedAt: Date.now() });
    router.push("/discover");
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">發一帖</h1>

      <Label>書</Label>
      <BookPicker value={bookId} onChange={setBookId} />

      <Label className="mt-6">目前進度</Label>
      <ProgressSlider value={progress} onChange={setProgress} />

      <Label className="mt-6">為什麼想讀</Label>
      <Textarea value={whyRead} onChange={(e) => setWhyRead(e.target.value)} />

      <Label className="mt-6">期待對方</Label>
      <Textarea value={partnerExpectation} onChange={(e) => setPartner(e.target.value)} />

      <Label className="mt-6">預期週數</Label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {WEEKS.map((w) => (
          <button key={w} onClick={() => setWeeks(w)}
            className={`py-2 rounded-xl border text-sm ${weeks === w ? "border-sage bg-sage text-cream" : "border-tag/40"}`}>{w}</button>
        ))}
      </div>

      <div className="mt-10">
        <Button onClick={submit} disabled={!valid}>發布</Button>
      </div>
    </PageContainer>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-walnut-soft text-sm mb-2 ${className}`}>{children}</div>;
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/discover/new components/shared/ProgressSlider.tsx components/shared/BookPicker.tsx
git commit -m "feat(phase-6): create-post form"
```

---

### Task 6.2: 申請（Apply）表單

**Files:**
- Create: `app/(main)/apply/[postId]/page.tsx`、`lib/signature.ts`、`tests/lib/signature.test.ts`

- [ ] **Step 1: 簽名工具測試**

```ts
// tests/lib/signature.test.ts
import { describe, it, expect } from "vitest";
import { signApplication } from "@/lib/signature";

describe("signApplication", () => {
  it("prepends recipient name", () => {
    expect(signApplication("Alice", "我也想讀這本"))
      .toBe("Dear Alice，\n我也想讀這本");
  });
  it("trims input", () => {
    expect(signApplication("Ben", "  hi  ")).toBe("Dear Ben，\nhi");
  });
});
```

- [ ] **Step 2: 寫 signature.ts**

```ts
// lib/signature.ts
export function signApplication(recipientName: string, body: string) {
  return `Dear ${recipientName}，\n${body.trim()}`;
}
```

- [ ] **Step 3: Apply page**

```tsx
// app/(main)/apply/[postId]/page.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import { signApplication } from "@/lib/signature";

export default function ApplyPage() {
  const router = useRouter();
  const { postId } = useParams<{ postId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const post  = useFolioStore((s) => s.posts[postId]);
  const owner = useFolioStore((s) => post && s.users[post.ownerId]);
  const book  = useFolioStore((s) => post && s.books[post.bookId]);
  const myProgress = useFolioStore((s) => meId && post ? s.progress[`${meId}:${post.bookId}`] : null);
  const upsertApplication = useFolioStore((s) => s.upsertApplication);
  const upsertProgress    = useFolioStore((s) => s.upsertProgress);

  const [progress, setProgress] = useState(myProgress?.percent ?? 0);
  const [whyRead, setWhyRead] = useState("");
  const [selfOffer, setSelfOffer] = useState("");
  const [weeks, setWeeks] = useState(post?.expectedWeeks ?? 4);

  if (!post || !owner || !book || !meId) return null;

  const valid = whyRead.trim() && selfOffer.trim();

  const submit = () => {
    const id = `a-${Date.now()}`;
    upsertApplication({
      id, postId: post.id, applicantId: meId,
      progressAtApply: progress,
      whyRead: signApplication(owner.nickname, whyRead),
      selfOffer: selfOffer.trim(),
      expectedWeeks: weeks,
      status: "pending",
      createdAt: Date.now(),
    });
    upsertProgress({ userId: meId, bookId: post.bookId, percent: progress, updatedAt: Date.now() });
    router.push("/discover");
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut">申請《{book.title}》共讀</h1>
      <p className="text-walnut-soft text-sm mt-1">寫給 {owner.nickname} 看</p>

      <Label className="mt-6">我目前進度</Label>
      <ProgressSlider value={progress} onChange={setProgress} />

      <Label className="mt-6">為什麼想加入這本書的共讀</Label>
      <Textarea value={whyRead} onChange={(e) => setWhyRead(e.target.value)} />
      <p className="text-walnut-soft text-xs mt-1">送出時會自動署名 Dear {owner.nickname}</p>

      <Label className="mt-6">我能成為怎樣的讀書夥伴</Label>
      <Textarea value={selfOffer} onChange={(e) => setSelfOffer(e.target.value)} />

      <Label className="mt-6">預期讀完週數</Label>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {[2, 4, 6, 8, 12].map((w) => (
          <button key={w} onClick={() => setWeeks(w)}
            className={`py-2 rounded-xl border text-sm ${weeks === w ? "border-sage bg-sage text-cream" : "border-tag/40"}`}>{w}</button>
        ))}
      </div>

      <div className="mt-10">
        <Button onClick={submit} disabled={!valid}>送出申請</Button>
      </div>
    </PageContainer>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-walnut-soft text-sm mb-2 ${className}`}>{children}</div>;
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/apply lib/signature.ts tests/lib/signature.test.ts
git commit -m "feat(phase-6): apply form with auto-signature"
```

---

### Task 6.3: Post 主人查看申請者 + 配對

**Files:**
- Create: `app/(main)/discover/post/[id]/applicants/page.tsx`

- [ ] **Step 1: Applicants page**

```tsx
// app/(main)/discover/post/[id]/applicants/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StanceBadge from "@/components/feed/StanceBadge";

export default function Applicants() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const post = useFolioStore((s) => s.posts[id]);
  const apps = useFolioStore((s) => Object.values(s.applications).filter((a) => a.postId === id));
  const users = useFolioStore((s) => s.users);
  const upsertApplication = useFolioStore((s) => s.upsertApplication);
  const upsertRoom = useFolioStore((s) => s.upsertRoom);

  if (!post) return null;

  const accept = (appId: string) => {
    const app = useFolioStore.getState().applications[appId];
    if (!app) return;
    const roomId = `r-${Date.now()}`;
    upsertRoom({
      id: roomId, postId: post.id,
      userAId: post.ownerId, userBId: app.applicantId,
      bookId: post.bookId,
      createdAt: Date.now(), chatUnlockedAt: null, celebratedAt: null,
    });
    upsertApplication({ ...app, status: "accepted" });
    router.push(`/room/${roomId}`);
  };
  const reject = (appId: string) => {
    const app = useFolioStore.getState().applications[appId];
    if (!app) return;
    upsertApplication({ ...app, status: "rejected" });
  };

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-walnut mb-6">申請者</h1>

      {apps.length === 0 && <div className="text-walnut-soft">還沒有人申請。</div>}

      <div className="space-y-3">
        {apps.map((a) => {
          const u = users[a.applicantId];
          if (!u) return null;
          return (
            <div key={a.id} className="p-5 rounded-2xl bg-cream border border-tag/30">
              <div className="flex justify-between items-start gap-2">
                <div className="font-display text-lg text-walnut">{u.nickname} ・ {a.progressAtApply}%</div>
                <StanceBadge stance={u.stance} />
              </div>
              <p className="text-walnut text-sm mt-3 whitespace-pre-line">{a.whyRead}</p>
              <p className="text-walnut-soft text-sm mt-2"><span className="font-medium">能成為：</span>{a.selfOffer}</p>

              {a.status === "pending" ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" onClick={() => reject(a.id)}>拒絕</Button>
                  <Button onClick={() => accept(a.id)}>接受</Button>
                </div>
              ) : (
                <div className="mt-3 text-sage text-sm">已 {a.status === "accepted" ? "接受" : "拒絕"}</div>
              )}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/discover/post/\[id\]/applicants
git commit -m "feat(phase-6): applicants list with accept/reject"
```

---

# Phase 7: Common Room (共讀室)

### Task 7.1: Unlock 邏輯（lib/unlock）+ 測試

**Files:**
- Create: `lib/unlock.ts`、`tests/lib/unlock.test.ts`

- [ ] **Step 1: 寫測試**

```ts
// tests/lib/unlock.test.ts
import { describe, it, expect } from "vitest";
import { canUnlockChat } from "@/lib/unlock";

describe("canUnlockChat", () => {
  const baseProgress = (a: number, b: number) => ({ a, b });
  const baseHas25 = (a: boolean, b: boolean) => ({ a, b });

  it("returns false when both < 25%", () => {
    expect(canUnlockChat(baseProgress(10, 5), baseHas25(false, false))).toBe(false);
  });
  it("returns false when only one side meets both", () => {
    expect(canUnlockChat(baseProgress(40, 10), baseHas25(true, false))).toBe(false);
  });
  it("returns false when both ≥ 25 but missing 心得", () => {
    expect(canUnlockChat(baseProgress(40, 30), baseHas25(false, true))).toBe(false);
  });
  it("returns true when both meet both", () => {
    expect(canUnlockChat(baseProgress(40, 30), baseHas25(true, true))).toBe(true);
  });
});
```

- [ ] **Step 2: 寫實作**

```ts
// lib/unlock.ts
export function canUnlockChat(
  progress: { a: number; b: number },
  has25Note: { a: boolean; b: boolean },
): boolean {
  return progress.a >= 25 && progress.b >= 25 && has25Note.a && has25Note.b;
}
```

- [ ] **Step 3: Commit**

```bash
npm test -- --run unlock
git add lib/unlock.ts tests/lib/unlock.test.ts
git commit -m "feat(phase-7): chat unlock logic"
```

---

### Task 7.2: Room 頁面（鎖定狀態 + 進度卡 + 便利貼牆）

**Files:**
- Create: `app/(main)/room/[id]/page.tsx`、`components/room/ProgressCard.tsx`、`components/room/StickyNoteWall.tsx`、`components/notes/StickyNote.tsx`

- [ ] **Step 1: StickyNote**

```tsx
// components/notes/StickyNote.tsx
import { useFolioStore } from "@/lib/store";
import clsx from "clsx";

const TONES = ["bg-amber-100", "bg-rose-100", "bg-emerald-100", "bg-sky-100"];

export default function StickyNote({ noteId }: { noteId: string }) {
  const note = useFolioStore((s) => s.notes[noteId]);
  const author = useFolioStore((s) => note && s.users[note.userId]);
  if (!note || !author) return null;

  const tone = TONES[note.id.charCodeAt(note.id.length - 1) % TONES.length];

  return (
    <div className={clsx("p-4 rounded-md shadow-sm rotate-[-1deg]", tone)}>
      {note.prompt && <div className="text-walnut-soft text-xs mb-1">{note.prompt}</div>}
      <p className="text-walnut text-sm whitespace-pre-line">{note.content}</p>
      <div className="text-walnut-soft text-[10px] mt-2">— {author.nickname}</div>
    </div>
  );
}
```

- [ ] **Step 2: StickyNoteWall**

```tsx
// components/room/StickyNoteWall.tsx
import { useFolioStore } from "@/lib/store";
import StickyNote from "@/components/notes/StickyNote";

export default function StickyNoteWall({ bookId, userIds }: { bookId: string; userIds: string[] }) {
  const notes = useFolioStore((s) =>
    Object.values(s.notes)
      .filter((n) => n.bookId === bookId && userIds.includes(n.userId))
      .sort((a, b) => b.createdAt - a.createdAt)
  );
  if (notes.length === 0) {
    return <div className="text-walnut-soft text-sm text-center py-6">還沒有便利貼。</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {notes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}
    </div>
  );
}
```

- [ ] **Step 3: ProgressCard**

```tsx
// components/room/ProgressCard.tsx
import { useFolioStore } from "@/lib/store";

export default function ProgressCard({ userIds }: { userIds: [string, string] }) {
  const users = useFolioStore((s) => userIds.map((id) => s.users[id]));
  const progress = useFolioStore((s) => userIds.map((id, i) => s.progress[`${id}:${useFolioStore.getState().rooms[Object.keys(useFolioStore.getState().rooms)[0]]?.bookId}`])); // simpler in real use; refactor below
  // 直接讓父層傳入 percent，較不出錯：見下方 page 用法

  // 此元件保持精簡：父層傳 percentages
  return null as any;
}
```

> 簡化策略：把 ProgressCard 改成 stateless 接 props（父層算好），如下：

```tsx
// components/room/ProgressCard.tsx
export default function ProgressCard({ a, b }: {
  a: { name: string; percent: number };
  b: { name: string; percent: number };
}) {
  return (
    <div className="bg-cream rounded-2xl p-4 border border-tag/30 grid grid-cols-2 gap-3">
      <Side {...a} />
      <Side {...b} />
    </div>
  );
}

function Side({ name, percent }: { name: string; percent: number }) {
  return (
    <div>
      <div className="text-walnut-soft text-xs">{name}</div>
      <div className="font-display text-3xl text-sage mt-1">{percent}%</div>
      <div className="h-1.5 bg-tag/30 rounded-full mt-2 overflow-hidden">
        <div className="h-full bg-sage transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Room page（鎖 / 解鎖兩態）**

```tsx
// app/(main)/room/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import { canUnlockChat } from "@/lib/unlock";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import ProgressCard from "@/components/room/ProgressCard";
import StickyNoteWall from "@/components/room/StickyNoteWall";

export default function Room() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const users = useFolioStore((s) => s.users);
  const progress = useFolioStore((s) => s.progress);
  const notes = useFolioStore((s) => s.notes);
  const upsertRoom = useFolioStore((s) => s.upsertRoom);

  if (!room || !meId) return null;
  const otherId = room.userAId === meId ? room.userBId : room.userAId;
  const me = users[meId], other = users[otherId];
  const myP = progress[`${meId}:${room.bookId}`]?.percent ?? 0;
  const oP  = progress[`${otherId}:${room.bookId}`]?.percent ?? 0;

  const has25 = (uid: string) =>
    Object.values(notes).some((n) => n.bookId === room.bookId && n.userId === uid && n.type === "milestone_25");

  const canUnlock = canUnlockChat({ a: myP, b: oP }, { a: has25(meId), b: has25(otherId) });

  // 一旦 canUnlock = true、寫入 chatUnlockedAt
  if (canUnlock && !room.chatUnlockedAt) {
    upsertRoom({ ...room, chatUnlockedAt: Date.now() });
  }

  return (
    <PageContainer>
      <h1 className="font-display text-2xl text-walnut">與 {other?.nickname} 共讀</h1>
      <p className="text-walnut-soft text-sm mt-1">《{useFolioStore.getState().books[room.bookId]?.title}》</p>

      <div className="mt-4">
        <ProgressCard a={{ name: me!.nickname, percent: myP }} b={{ name: other!.nickname, percent: oP }} />
      </div>

      <div className="mt-6">
        <Button onClick={() => router.push(`/room/${room.id}/update`)}>更新進度 / 寫便利貼</Button>
      </div>

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">便利貼牆</h2>
      <StickyNoteWall bookId={room.bookId} userIds={[meId, otherId]} />

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">聊天</h2>
      {room.chatUnlockedAt ? (
        <div onClick={() => router.push(`/room/${room.id}/chat`)} className="p-4 bg-cream rounded-xl border border-tag/30 cursor-pointer">
          進入聊天 →
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-tag/10 border-2 border-dashed border-tag/40 text-center">
          <div className="text-walnut-soft text-sm">聊天上鎖中</div>
          <div className="text-walnut text-sm mt-2 leading-relaxed">
            雙方都需要：<br/>
            ✓ 進度 ≥ 25%<br/>
            ✓ 寫完 25% 心得
          </div>
        </div>
      )}
    </PageContainer>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/\(main\)/room components/room components/notes/StickyNote.tsx
git commit -m "feat(phase-7): room with progress card, sticky wall, lock state"
```

---

### Task 7.3: 更新進度 + 25% 心得 trigger

**Files:**
- Create: `app/(main)/room/[id]/update/page.tsx`、`components/notes/NotePromptModal.tsx`、`lib/note-prompts.ts`

- [ ] **Step 1: Note prompts**

```ts
// lib/note-prompts.ts
export const PROMPT_25 = [
  "目前你對這本書的感受？",
  "印象最深的一段或一句？",
  "有什麼疑問或不認同的？",
];
export const PROMPT_100 = [
  "讀完之後最大的收穫？",
  "想推薦給怎樣的人？",
  "若給星星評分（1–5）你會給幾顆？",
];
```

- [ ] **Step 2: NotePromptModal**

```tsx
// components/notes/NotePromptModal.tsx
"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function NotePromptModal({
  open, onClose, prompts, requireOne, title, onSave, allowSkip = false,
}: {
  open: boolean; onClose: () => void;
  prompts: string[]; requireOne: boolean;
  title: string;
  onSave: (entries: { prompt: string; content: string }[]) => void;
  allowSkip?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const filled = Object.values(answers).filter((v) => v.trim()).length;
  const canSubmit = !requireOne || filled >= 1;

  const submit = () => {
    const entries = prompts.map((p, i) => ({ prompt: p, content: (answers[i] ?? "").trim() }))
      .filter((e) => e.content);
    onSave(entries);
  };

  return (
    <Modal open={open}>
      <h3 className="font-display text-xl text-walnut">{title}</h3>
      <p className="text-walnut-soft text-sm mt-1">至少答 1 題</p>

      <div className="space-y-4 mt-4">
        {prompts.map((p, i) => (
          <div key={i}>
            <div className="text-walnut text-sm mb-1">{p}</div>
            <Textarea value={answers[i] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {allowSkip ? (
          <Button variant="outline" onClick={onClose}>跳過</Button>
        ) : (
          <Button variant="outline" onClick={onClose}>稍後</Button>
        )}
        <Button onClick={submit} disabled={!canSubmit}>送出</Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: Update page**

```tsx
// app/(main)/room/[id]/update/page.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import NotePromptModal from "@/components/notes/NotePromptModal";
import { PROMPT_25, PROMPT_100 } from "@/lib/note-prompts";

export default function Update() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const myProgress = useFolioStore((s) => meId && room ? s.progress[`${meId}:${room.bookId}`] : null);
  const notes = useFolioStore((s) => s.notes);
  const upsertProgress = useFolioStore((s) => s.upsertProgress);
  const upsertNote = useFolioStore((s) => s.upsertNote);

  const [percent, setPercent] = useState(myProgress?.percent ?? 0);
  const [free, setFree] = useState("");
  const [show25, setShow25] = useState(false);
  const [show100, setShow100] = useState(false);

  if (!meId || !room) return null;

  const has25 = Object.values(notes).some((n) => n.userId === meId && n.bookId === room.bookId && n.type === "milestone_25");

  const saveProgress = () => {
    upsertProgress({ userId: meId, bookId: room.bookId, percent, updatedAt: Date.now() });
    if (percent >= 25 && !has25) setShow25(true);
    else if (percent >= 100) setShow100(true);
    else router.push(`/room/${room.id}`);
  };

  const saveFree = () => {
    if (!free.trim()) return;
    upsertNote({
      id: `n-${Date.now()}`, userId: meId, bookId: room.bookId,
      type: "free", content: free.trim(), createdAt: Date.now(),
    });
    setFree("");
  };

  const save25 = (entries: { prompt: string; content: string }[]) => {
    entries.forEach((e, i) => {
      upsertNote({
        id: `n-${Date.now()}-${i}`, userId: meId, bookId: room.bookId,
        type: "milestone_25", prompt: e.prompt, content: e.content, createdAt: Date.now() + i,
      });
    });
    setShow25(false);
    if (percent >= 100) setShow100(true);
    else router.push(`/room/${room.id}`);
  };

  const save100 = (entries: { prompt: string; content: string }[]) => {
    entries.forEach((e, i) => {
      upsertNote({
        id: `n-${Date.now()}-${i}`, userId: meId, bookId: room.bookId,
        type: "milestone_100", prompt: e.prompt, content: e.content, createdAt: Date.now() + i,
      });
    });
    setShow100(false);
    router.push(`/shelf/${room.bookId}/compilation`);
  };

  return (
    <PageContainer>
      <h1 className="font-display text-2xl text-walnut mb-6">更新進度與心得</h1>

      <div className="text-walnut-soft text-sm mb-2">目前進度</div>
      <ProgressSlider value={percent} onChange={setPercent} />
      <div className="mt-4"><Button onClick={saveProgress}>儲存進度</Button></div>

      <div className="mt-10">
        <div className="text-walnut-soft text-sm mb-2">隨時心得（隨手寫一張便利貼）</div>
        <Textarea value={free} onChange={(e) => setFree(e.target.value)} />
        <div className="mt-2"><Button variant="outline" onClick={saveFree} disabled={!free.trim()}>貼上牆</Button></div>
      </div>

      <NotePromptModal open={show25} onClose={() => { setShow25(false); router.push(`/room/${room.id}`); }}
        prompts={PROMPT_25} requireOne title="🎉 25% 心得（必填）" onSave={save25} />

      <NotePromptModal open={show100} onClose={() => { setShow100(false); router.push(`/shelf/${room.bookId}/compilation`); }}
        prompts={PROMPT_100} requireOne={false} title="📖 完成 100%！要寫個總結嗎？" onSave={save100} allowSkip />
    </PageContainer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/room/\[id\]/update components/notes/NotePromptModal.tsx lib/note-prompts.ts
git commit -m "feat(phase-7): progress update + 25%/100% prompt modals"
```

---

### Task 7.4: 聊天頁（解鎖後）

**Files:**
- Create: `app/(main)/room/[id]/chat/page.tsx`、`components/room/ChatLog.tsx`、`lib/format-time.ts`、`tests/lib/format-time.test.ts`

- [ ] **Step 1: format-time 測試**

```ts
// tests/lib/format-time.test.ts
import { describe, it, expect } from "vitest";
import { isSameDay, formatLocalTime, formatDayLabel } from "@/lib/format-time";

describe("format-time", () => {
  it("isSameDay true on same calendar day", () => {
    const a = new Date("2026-05-07T03:00:00Z").getTime();
    const b = new Date("2026-05-07T20:00:00Z").getTime();
    expect(isSameDay(a, b)).toBe(true);
  });
  it("isSameDay false across days", () => {
    const a = new Date("2026-05-07T23:00:00Z").getTime();
    const b = new Date("2026-05-09T02:00:00Z").getTime();
    expect(isSameDay(a, b)).toBe(false);
  });
  it("formatLocalTime returns hh:mm style", () => {
    const ts = new Date("2026-05-07T08:30:00").getTime();
    expect(formatLocalTime(ts)).toMatch(/\d{1,2}:\d{2}/);
  });
});
```

- [ ] **Step 2: format-time.ts**

```ts
// lib/format-time.ts
export function isSameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth() === db.getMonth() &&
         da.getDate() === db.getDate();
}

export function formatLocalTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (isSameDay(ts, today.getTime())) return "今天";
  const y = new Date(today); y.setDate(y.getDate() - 1);
  if (isSameDay(ts, y.getTime())) return "昨天";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}
```

- [ ] **Step 3: ChatLog**

```tsx
// components/room/ChatLog.tsx
import { useFolioStore } from "@/lib/store";
import { isSameDay, formatLocalTime, formatDayLabel } from "@/lib/format-time";
import clsx from "clsx";

export default function ChatLog({ roomId, meId }: { roomId: string; meId: string }) {
  const messages = useFolioStore((s) =>
    Object.values(s.messages).filter((m) => m.roomId === roomId).sort((a, b) => a.createdAt - b.createdAt)
  );
  if (messages.length === 0) {
    return <div className="text-walnut-soft text-center py-8">還沒對話。打第一句吧。</div>;
  }
  const blocks: Array<{ kind: "day"; ts: number } | { kind: "msg"; m: typeof messages[number] }> = [];
  messages.forEach((m, i) => {
    if (i === 0 || !isSameDay(m.createdAt, messages[i-1].createdAt)) {
      blocks.push({ kind: "day", ts: m.createdAt });
    }
    blocks.push({ kind: "msg", m });
  });
  return (
    <div className="space-y-2">
      {blocks.map((b, i) =>
        b.kind === "day" ? (
          <div key={i} className="text-center text-walnut-soft text-xs py-2">{formatDayLabel(b.ts)}</div>
        ) : (
          <div key={i} className={clsx("flex", b.m.senderId === meId ? "justify-end" : "justify-start")}>
            <div className={clsx("max-w-[75%] rounded-2xl px-4 py-2",
              b.m.senderId === meId ? "bg-sage text-cream" : "bg-cream border border-tag/30 text-walnut")}>
              <div className="whitespace-pre-line">{b.m.content}</div>
              <div className={clsx("text-[10px] mt-1", b.m.senderId === meId ? "text-cream/70" : "text-walnut-soft")}>
                {formatLocalTime(b.m.createdAt)}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
```

- [ ] **Step 4: Chat page**

```tsx
// app/(main)/room/[id]/chat/page.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ChatLog from "@/components/room/ChatLog";

export default function Chat() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const room = useFolioStore((s) => s.rooms[id]);
  const otherName = useFolioStore((s) => {
    if (!room || !meId) return "";
    const otherId = room.userAId === meId ? room.userBId : room.userAId;
    return s.users[otherId]?.nickname ?? "";
  });
  const append = useFolioStore((s) => s.appendMessage);

  const [text, setText] = useState("");

  if (!meId || !room) return null;
  if (!room.chatUnlockedAt) {
    router.replace(`/room/${room.id}`);
    return null;
  }

  const send = () => {
    if (!text.trim()) return;
    append({ id: `m-${Date.now()}`, roomId: room.id, senderId: meId, content: text.trim(), createdAt: Date.now() });
    setText("");
  };

  return (
    <PageContainer className="flex flex-col h-screen pb-32">
      <button onClick={() => router.push(`/room/${room.id}`)} className="text-sage text-sm">← 回共讀室</button>
      <h1 className="font-display text-2xl text-walnut mt-3">與 {otherName}</h1>

      <div className="flex-1 overflow-y-auto mt-4 -mx-2 px-2"><ChatLog roomId={room.id} meId={meId} /></div>

      <div className="fixed inset-x-0 bottom-16 max-w-[480px] mx-auto px-6 py-3 bg-parchment border-t border-tag/30 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="說點什麼…"
          onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button onClick={send} className="w-auto px-6">送出</Button>
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/\(main\)/room/\[id\]/chat components/room/ChatLog.tsx lib/format-time.ts tests/lib/format-time.test.ts
git commit -m "feat(phase-7): chat with day separators and local time"
```

---

# Phase 8: 100% Events

### Task 8.1: 個人 100% 整理頁

**Files:**
- Create: `app/(main)/shelf/[bookId]/compilation/page.tsx`

- [ ] **Step 1: Compilation page**

```tsx
// app/(main)/shelf/[bookId]/compilation/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StickyNote from "@/components/notes/StickyNote";

export default function Compilation() {
  const router = useRouter();
  const { bookId } = useParams<{ bookId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const book = useFolioStore((s) => s.books[bookId]);
  const me   = useFolioStore((s) => meId ? s.users[meId] : null);
  const myNotes = useFolioStore((s) =>
    Object.values(s.notes).filter((n) => n.userId === meId && n.bookId === bookId)
      .sort((a, b) => a.createdAt - b.createdAt)
  );

  if (!book || !me) return null;

  const share = async () => {
    const text = `📖《${book.title}》— ${me.nickname} 的閱讀整理 #Folio`;
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title: "Folio", text, url: location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${location.href}`);
      alert("已複製分享連結");
    }
  };

  return (
    <PageContainer>
      <button onClick={() => router.back()} className="text-sage text-sm">← 回</button>
      <div className="text-center mt-6">
        <div className="font-display text-walnut text-sm">— {me.nickname} 與 —</div>
        <h1 className="font-display text-4xl text-walnut mt-2">《{book.title}》</h1>
        <div className="text-walnut-soft text-sm mt-2">的閱讀整理</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        {myNotes.length === 0
          ? <div className="col-span-2 text-walnut-soft text-center py-8">這本書還沒有便利貼</div>
          : myNotes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}
      </div>

      <div className="mt-12 space-y-3">
        <Button onClick={share}>分享到社交媒體</Button>
        <div className="text-walnut-soft text-xs text-center">— Folio —</div>
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/shelf/\[bookId\]/compilation
git commit -m "feat(phase-8): personal 100% compilation page with share"
```

---

### Task 8.2: Room 雙方 100% 慶祝

**Files:**
- Create: `components/room/Celebration.tsx`
- Modify: `app/(main)/room/[id]/page.tsx` 加入慶祝偵測

- [ ] **Step 1: Celebration**

```tsx
// components/room/Celebration.tsx
"use client";
import { motion } from "framer-motion";
import { useFolioStore } from "@/lib/store";

export default function Celebration({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  const room = useFolioStore((s) => s.rooms[roomId]);
  const userA = useFolioStore((s) => room && s.users[room.userAId]);
  const userB = useFolioStore((s) => room && s.users[room.userBId]);
  const book  = useFolioStore((s) => room && s.books[room.bookId]);
  if (!room || !userA || !userB || !book) return null;

  const days = Math.ceil((Date.now() - room.createdAt) / 86_400_000);

  return (
    <motion.div className="fixed inset-0 bg-walnut/70 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-cream rounded-3xl p-8 max-w-[420px] w-full text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="font-display text-3xl text-walnut mt-4">你們做到了</h2>
        <p className="text-walnut-soft mt-2">
          <span className="text-walnut">{userA.nickname}</span> 與 <span className="text-walnut">{userB.nickname}</span><br/>
          一起讀完了 《{book.title}》
        </p>
        <p className="text-walnut-soft text-sm mt-4">共讀 {days} 天</p>
        <div className="mt-8">
          <button onClick={onClose} className="bg-sage text-cream rounded-full py-3 px-8">收下這份紀念</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: 在 Room page 加入慶祝偵測**

修改 `app/(main)/room/[id]/page.tsx` — 在 `if (canUnlock && !room.chatUnlockedAt)` 之後加：

```tsx
import { useState, useEffect } from "react";
import Celebration from "@/components/room/Celebration";
// ...
const [celebrating, setCelebrating] = useState(false);
useEffect(() => {
  const bothDone = myP >= 100 && oP >= 100;
  if (bothDone && !room.celebratedAt) {
    setCelebrating(true);
    upsertRoom({ ...room, celebratedAt: Date.now() });
  }
}, [myP, oP, room]);

// 在 return 內加：
{celebrating && <Celebration roomId={room.id} onClose={() => setCelebrating(false)} />}
```

- [ ] **Step 3: Commit**

```bash
git add components/room/Celebration.tsx app/\(main\)/room
git commit -m "feat(phase-8): room mutual 100% celebration"
```

---

# Phase 9: Bookshelf

### Task 9.1: 書櫃首頁

**Files:**
- Create: `app/(main)/shelf/page.tsx`、`components/shelf/BookRow.tsx`

- [ ] **Step 1: BookRow**

```tsx
// components/shelf/BookRow.tsx
import Link from "next/link";
import { useFolioStore } from "@/lib/store";

export default function BookRow({ bookId, percent }: { bookId: string; percent: number }) {
  const book = useFolioStore((s) => s.books[bookId]);
  if (!book) return null;
  return (
    <Link href={`/shelf/${book.id}`}
      className="block bg-cream border border-tag/30 rounded-xl px-4 py-3 hover:border-sage transition-colors">
      <div className="flex justify-between items-center">
        <div className="font-display text-lg text-walnut">{book.title}</div>
        <div className="font-display text-sage">{percent}%</div>
      </div>
      <div className="h-1 bg-tag/30 rounded-full mt-2 overflow-hidden">
        <div className="h-full bg-sage" style={{ width: `${percent}%` }} />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Shelf page**

```tsx
// app/(main)/shelf/page.tsx
"use client";
import { useState } from "react";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BookPicker from "@/components/shared/BookPicker";
import ProgressSlider from "@/components/shared/ProgressSlider";
import BookRow from "@/components/shelf/BookRow";

export default function Shelf() {
  const meId = useFolioStore((s) => s.currentUserId);
  const myEntries = useFolioStore((s) =>
    Object.values(s.progress).filter((p) => p.userId === meId).sort((a, b) => b.updatedAt - a.updatedAt)
  );
  const upsertProgress = useFolioStore((s) => s.upsertProgress);

  const [open, setOpen] = useState(false);
  const [bookId, setBookId] = useState("");
  const [percent, setPercent] = useState(0);

  if (!meId) return null;

  const addBook = () => {
    if (!bookId) return;
    upsertProgress({ userId: meId, bookId, percent, updatedAt: Date.now() });
    setOpen(false); setBookId(""); setPercent(0);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">書櫃</h1>
        <button onClick={() => setOpen(true)} className="text-sage text-sm">＋ 加書</button>
      </div>

      {myEntries.length === 0 && (
        <div className="text-walnut-soft text-center mt-12">
          還沒有書。<br/>加一本開始讀，或去探索找夥伴。
        </div>
      )}

      <div className="space-y-2">
        {myEntries.map((e) => <BookRow key={e.bookId} bookId={e.bookId} percent={e.percent} />)}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-display text-xl text-walnut">加一本書到書櫃</h3>
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-walnut-soft text-sm mb-2">選擇或輸入書名</div>
            <BookPicker value={bookId} onChange={setBookId} />
          </div>
          <div>
            <div className="text-walnut-soft text-sm mb-2">目前進度</div>
            <ProgressSlider value={percent} onChange={setPercent} />
          </div>
          <Button onClick={addBook} disabled={!bookId}>加入書櫃</Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(main\)/shelf/page.tsx components/shelf
git commit -m "feat(phase-9): bookshelf with solo-mode add"
```

---

### Task 9.2: 單本書詳細頁

**Files:**
- Create: `app/(main)/shelf/[bookId]/page.tsx`

- [ ] **Step 1: Book detail page**

```tsx
// app/(main)/shelf/[bookId]/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import ProgressSlider from "@/components/shared/ProgressSlider";
import StickyNote from "@/components/notes/StickyNote";

export default function BookDetail() {
  const router = useRouter();
  const { bookId } = useParams<{ bookId: string }>();
  const meId = useFolioStore((s) => s.currentUserId);
  const book = useFolioStore((s) => s.books[bookId]);
  const myProgress = useFolioStore((s) => meId && s.progress[`${meId}:${bookId}`]);
  const myNotes = useFolioStore((s) =>
    Object.values(s.notes).filter((n) => n.userId === meId && n.bookId === bookId)
      .sort((a, b) => b.createdAt - a.createdAt)
  );
  const upsertProgress = useFolioStore((s) => s.upsertProgress);
  const upsertNote = useFolioStore((s) => s.upsertNote);

  const [percent, setPercent] = useState(myProgress?.percent ?? 0);
  const [free, setFree] = useState("");

  if (!book || !meId) return null;

  const saveProgress = () => {
    upsertProgress({ userId: meId, bookId, percent, updatedAt: Date.now() });
  };
  const addFree = () => {
    if (!free.trim()) return;
    upsertNote({ id: `n-${Date.now()}`, userId: meId, bookId, type: "free", content: free.trim(), createdAt: Date.now() });
    setFree("");
  };

  return (
    <PageContainer>
      <button onClick={() => router.back()} className="text-sage text-sm">← 回書櫃</button>
      <h1 className="font-display text-3xl text-walnut mt-3">《{book.title}》</h1>

      <div className="mt-6">
        <div className="text-walnut-soft text-sm mb-2">進度</div>
        <ProgressSlider value={percent} onChange={setPercent} />
        <div className="mt-3"><Button onClick={saveProgress}>儲存</Button></div>
      </div>

      {percent >= 100 && (
        <div className="mt-6">
          <Link href={`/shelf/${bookId}/compilation`}>
            <Button variant="outline">查看 100% 整理頁</Button>
          </Link>
        </div>
      )}

      <div className="mt-10">
        <div className="text-walnut-soft text-sm mb-2">寫一張便利貼</div>
        <Textarea value={free} onChange={(e) => setFree(e.target.value)} />
        <div className="mt-2"><Button variant="outline" onClick={addFree} disabled={!free.trim()}>貼上牆</Button></div>
      </div>

      <h2 className="font-display text-xl text-walnut mt-8 mb-3">我的便利貼</h2>
      {myNotes.length === 0
        ? <div className="text-walnut-soft text-sm text-center py-6">還沒有便利貼。</div>
        : <div className="grid grid-cols-2 gap-3">{myNotes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}</div>}
    </PageContainer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/shelf/\[bookId\]/page.tsx
git commit -m "feat(phase-9): per-book detail with progress + notes"
```

---

# Phase 10: Polish

### Task 10.1: 頁面切換動畫 + 全域美化

**Files:**
- Create: `components/shared/PageTransition.tsx`
- Modify: 各 main 頁面套用 transition wrapper（可選）

- [ ] **Step 1: PageTransition**

```tsx
// components/shared/PageTransition.tsx
"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: 把 Onboarding / Welcome 各頁包起來（可選逐步加）**

例：在 `welcome/page.tsx` 把 `<main>` 內容用 `<PageTransition>` 包住。

- [ ] **Step 3: Commit**

```bash
git add components/shared/PageTransition.tsx
git commit -m "feat(phase-10): page transition wrapper"
```

---

### Task 10.2: README 寫操作指南 + 部署到 Vercel

**Files:**
- Create / Modify: `README.md`

- [ ] **Step 1: 寫 README**

```markdown
# Folio Web Prototype

**Demo URL:** (待部署) — Next.js + Tailwind v4 + Framer Motion + Zustand

## Quick Start

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 主要 demo 路徑

1. `/welcome` → 開始旅程 → 4 頁 onboarding
2. `/auth` → 「以 Alice demo 帳號繼續」直接跳到主畫面（含 mock 貼文）
3. `/discover` → 看 mock 貼文、發新帖、申請別人
4. `/room/<id>` → 進入共讀室、更新進度、寫便利貼、解鎖聊天
5. `/shelf` → 書櫃、加書（純個人模式）、單本詳細、100% 整理頁
6. `/me` → 我的頁面（編輯資料、心態冷卻 demo）

## 重置 demo

清 localStorage 即可：
```js
localStorage.removeItem('folio_state'); location.reload();
```

## 部署

```bash
npx vercel --prod
```
```

- [ ] **Step 2: 部署 demo**

```bash
npx vercel --prod
```

把得到的 URL 填回 README。

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs(phase-10): README + Vercel deployment notes"
```

---

# Self-Review（已完成）

✅ 所有 spec 章節都有對應 phase / task：
- 註冊：Phase 1-3
- Feed 過濾：Phase 5
- Post / Apply：Phase 6
- Room 解鎖：Phase 7
- 心得 / 25% / 100%：Phase 7、Phase 8
- 慶祝：Phase 8
- 我的頁面 / cooldown：Phase 4
- 書櫃 / 純個人模式：Phase 9

✅ 沒有 placeholder："TBD / TODO / handle edge cases" 的步驟皆已替換成實際代碼

✅ 型別與 API 一致：所有 task 共用 `lib/store.ts` 定義的 type；filter/cooldown/unlock util 簽名一致

✅ Bite-sized：每 task 平均 4-7 個 step、每 step 2-5 分鐘可完成

---

# 開發 Tips（給執行者）

- **每完成一個 task 就 commit**：細粒度可回滾
- **跑測試**：每改 lib/* 就 `npm test -- --run`
- **手動驗證**：每完成一個 phase，跑 `npm run dev` 點選關鍵流程
- **localStorage 重置**：開瀏覽器 DevTools → Application → Local Storage → `folio_state` → 刪除
- **mock 用戶切換**：登入畫面點「以 Alice demo 帳號繼續」即可切換為已存在用戶測試 feed
- **Watercolor 圖**：先放佔位 PNG，後期由你（產品方）替換為定稿插圖
