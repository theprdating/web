import type { User, Book, Post } from "./store";
import { useFolioStore } from "./store";

export const MOCK_USERS: User[] = [
  { id: "demo-self", nickname: "你", gender: "未填", age: 0, bookCategories: [], qaAnswers: {}, stance: "純粹書友", stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "fog", bg: "window-moon" } },
  { id: "alice",  nickname: "Alice",  gender: "female", age: 26, bookCategories: ["小說","哲學"], qaAnswers: { defining: "《小王子》— 永遠保留童心" }, stance: "純粹書友",   stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "sage", scarf: "lavender", holding: "book-open-cream" } },
  { id: "ben",    nickname: "Ben",    gender: "male",   age: 30, bookCategories: ["科技","商業"], qaAnswers: { titleOfMyLife: "《漫長的告白》" },     stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "amber", hat: "wool-amber", holding: "tea-cup" } },
  { id: "cleo",   nickname: "Cleo",   gender: "female", age: 23, bookCategories: ["詩集","散文"], qaAnswers: { readingHours: "7-14" },                stance: "純粹找緣分", stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "rose", hat: "flower-crown" } },
  { id: "dan",    nickname: "Dan",    gender: "male",   age: 28, bookCategories: ["心理","哲學"], qaAnswers: { defining: "《被討厭的勇氣》" },        stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "walnut", glasses: true, holding: "book-closed-sage" } },
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
  // Runs after hydrateFromStorage; only injects mock data when the store has no users,
  // so real user data is never overwritten.
  // Using a top-level import (instead of require) because the tsconfig uses
  // "module": "esnext" / "moduleResolution": "bundler" with strict mode,
  // which does not recognise require() as a typed call. No import cycle exists:
  // StoreHydrator imports mock-data and store independently; mock-data imports store.
  const s = useFolioStore.getState();
  if (Object.keys(s.users).length === 0) {
    MOCK_USERS.forEach(s.upsertUser);
    MOCK_BOOKS.forEach(s.upsertBook);
    MOCK_POSTS.forEach(s.upsertPost);
  }
}
