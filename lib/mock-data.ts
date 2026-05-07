import type { User, Book, Post } from "./store";
import { useFolioStore } from "./store";

export const MOCK_USERS: User[] = [
  { id: "demo-self", nickname: "你", gender: "未填", age: 0, bookCategories: [], qaAnswers: {}, stance: "純粹書友", stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "fog", bg: "window-moon" }, tutorialSeenAt: 1 },
  { id: "alice",  nickname: "Alice",  gender: "female", age: 26, bookCategories: ["小說","哲學"], qaAnswers: { defining: "《小王子》— 永遠保留童心" }, stance: "純粹書友",   stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "sage", scarf: "lavender", holding: "book-open-cream" }, tutorialSeenAt: 1 },
  { id: "ben",    nickname: "Ben",    gender: "male",   age: 30, bookCategories: ["科技","商業"], qaAnswers: { titleOfMyLife: "《漫長的告白》" },     stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "amber", hat: "wool-amber", holding: "tea-cup" }, tutorialSeenAt: 1 },
  { id: "cleo",   nickname: "Cleo",   gender: "female", age: 23, bookCategories: ["詩集","散文"], qaAnswers: { readingHours: "7-14" },                stance: "純粹找緣分", stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "rose", hat: "flower-crown" }, tutorialSeenAt: 1 },
  { id: "dan",    nickname: "Dan",    gender: "male",   age: 28, bookCategories: ["心理","哲學"], qaAnswers: { defining: "《被討厭的勇氣》" },        stance: "不拘",         stanceChangedAt: 0, nicknameChangedAt: 0, avatar: { base: "walnut", glasses: true, holding: "book-closed-sage" }, tutorialSeenAt: 1 },
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

export function seedDemoRoomsFor(meId: string) {
  // Late-bind require to avoid module-cycle issues
  const { useFolioStore } = require("./store") as typeof import("./store");
  const s = useFolioStore.getState();

  // Idempotency: skip if any demo room already exists for meId
  const alreadySeeded = Object.values(s.rooms).some((r) =>
    r.id.startsWith(`demo-`) && (r.userAId === meId || r.userBId === meId)
  );
  if (alreadySeeded) return;

  // Pick partners — only ben and dan (both 不拘, pair with anyone)
  const partnerPool = ["ben", "dan"].filter((id) => id !== meId);
  if (partnerPool.length === 0) return; // shouldn't happen for valid users

  const pickPartner = (i: number) => partnerPool[i % partnerPool.length];

  const NOW = Date.now();
  const DAY = 86_400_000;
  const HOUR = 3_600_000;
  const MIN = 60_000;

  // ---------- S1: 剛配對、雙方都還沒讀 (locked) ----------
  {
    const partner = pickPartner(0);
    const book = "b-prince";
    const roomId = `demo-s1-${meId}`;
    s.upsertRoom({
      id: roomId, postId: "demo-post-s1",
      userAId: partner, userBId: meId, bookId: book,
      createdAt: NOW - 1 * DAY,
      chatUnlockedAt: null, celebratedAt: null,
    });
    s.upsertProgress({ userId: meId, bookId: book, percent: 0, updatedAt: NOW - 1 * DAY });
    s.upsertProgress({ userId: partner, bookId: book, percent: 0, updatedAt: NOW - 1 * DAY });
  }

  // ---------- S2: 我已 25%+ 寫了心得、對方落後 (locked, waiting on partner) ----------
  {
    const partner = pickPartner(1);
    const book = "b-sapiens";
    const roomId = `demo-s2-${meId}`;
    s.upsertRoom({
      id: roomId, postId: "demo-post-s2",
      userAId: partner, userBId: meId, bookId: book,
      createdAt: NOW - 4 * DAY,
      chatUnlockedAt: null, celebratedAt: null,
    });
    s.upsertProgress({ userId: meId, bookId: book, percent: 35, updatedAt: NOW - 1 * DAY });
    s.upsertProgress({ userId: partner, bookId: book, percent: 8, updatedAt: NOW - 2 * DAY });
    s.upsertNote({
      id: `demo-s2-n1-${meId}`, userId: meId, bookId: book,
      type: "milestone_25",
      prompt: "目前你對這本書的感受？",
      content: "讀到第三章，覺得作者把人類演化講得有點哲學。期待後面的認知革命。",
      createdAt: NOW - 1 * DAY,
    });
    s.upsertNote({
      id: `demo-s2-n2-${meId}`, userId: meId, bookId: book,
      type: "free",
      content: "認知革命那段超震撼",
      createdAt: NOW - 12 * HOUR,
    });
  }

  // ---------- S3: 雙方解鎖、聊得正熱 (chat unlocked, mid-read) ----------
  {
    const partner = pickPartner(2);
    const book = "b-courage";
    const roomId = `demo-s3-${meId}`;
    s.upsertRoom({
      id: roomId, postId: "demo-post-s3",
      userAId: partner, userBId: meId, bookId: book,
      createdAt: NOW - 7 * DAY,
      chatUnlockedAt: NOW - 5 * DAY, celebratedAt: null,
    });
    s.upsertProgress({ userId: meId, bookId: book, percent: 55, updatedAt: NOW - 1 * DAY });
    s.upsertProgress({ userId: partner, bookId: book, percent: 60, updatedAt: NOW - 12 * HOUR });

    s.upsertNote({ id: `demo-s3-n1-${meId}`, userId: meId, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "課題分離的概念第一次聽到，需要消化", createdAt: NOW - 5 * DAY });
    s.upsertNote({ id: `demo-s3-n2-${meId}`, userId: meId, bookId: book, type: "free",
      content: "「自由是被人討厭」這句太狠", createdAt: NOW - 3 * DAY });
    s.upsertNote({ id: `demo-s3-n3-${meId}`, userId: partner, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "我比較喜歡阿德勒講人生不是線性的那段", createdAt: NOW - 4 * DAY });
    s.upsertNote({ id: `demo-s3-n4-${meId}`, userId: partner, bookId: book, type: "free",
      content: "我不太認同要徹底課題分離", createdAt: NOW - 2 * DAY });

    const msgs: { senderId: string; content: string; ageMs: number }[] = [
      { senderId: partner, content: "你進度好快", ageMs: 5 * DAY },
      { senderId: meId,    content: "我週末閉關 XD", ageMs: 5 * DAY - 2 * MIN },
      { senderId: partner, content: "課題分離那段你怎麼想？", ageMs: 3 * DAY },
      { senderId: meId,    content: "覺得理論上對、實務上難", ageMs: 3 * DAY - MIN },
      { senderId: partner, content: "我也是，尤其面對家人那段", ageMs: 3 * DAY - 30 * 1000 },
      { senderId: meId,    content: "之後讀完一起來辯論一下", ageMs: 1 * DAY },
    ];
    msgs.forEach((m, i) => s.appendMessage({
      id: `demo-s3-m${i + 1}-${meId}`, roomId, senderId: m.senderId, content: m.content,
      createdAt: NOW - m.ageMs,
    }));
  }

  // ---------- S4: 我已 100%、整理頁產出，對方還沒 (chat unlocked, me done) ----------
  {
    const partner = pickPartner(3);
    const book = "b-norwegian";
    const roomId = `demo-s4-${meId}`;
    s.upsertRoom({
      id: roomId, postId: "demo-post-s4",
      userAId: partner, userBId: meId, bookId: book,
      createdAt: NOW - 14 * DAY,
      chatUnlockedAt: NOW - 10 * DAY, celebratedAt: null,
    });
    s.upsertProgress({ userId: meId, bookId: book, percent: 100, updatedAt: NOW - 1 * DAY });
    s.upsertProgress({ userId: partner, bookId: book, percent: 80, updatedAt: NOW - 12 * HOUR });

    s.upsertNote({ id: `demo-s4-n1-${meId}`, userId: meId, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "村上的氛圍真的很黏人", createdAt: NOW - 9 * DAY });
    s.upsertNote({ id: `demo-s4-n2-${meId}`, userId: meId, bookId: book, type: "free",
      content: "直子的角色越來越難理解", createdAt: NOW - 5 * DAY });
    s.upsertNote({ id: `demo-s4-n3-${meId}`, userId: meId, bookId: book, type: "milestone_100",
      prompt: "讀完之後最大的收穫？",
      content: "整本就是一場潮濕又安靜的夢。給 4 顆星，會想再讀一次但要過幾年。",
      createdAt: NOW - 1 * DAY });
    s.upsertNote({ id: `demo-s4-n4-${meId}`, userId: partner, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "風格我滿喜歡的，文字像散步", createdAt: NOW - 8 * DAY });
    s.upsertNote({ id: `demo-s4-n5-${meId}`, userId: partner, bookId: book, type: "free",
      content: "讀到一半被工作打斷一陣", createdAt: NOW - 3 * DAY });

    const msgs: { senderId: string; content: string; ageMs: number }[] = [
      { senderId: partner, content: "你讀完了？", ageMs: 1 * DAY },
      { senderId: meId,    content: "嗯，剛剛", ageMs: 1 * DAY - 2 * MIN },
      { senderId: partner, content: "別劇透！我快了", ageMs: 1 * DAY - MIN },
      { senderId: meId,    content: "知道，等你 :)", ageMs: 1 * DAY - 30 * 1000 },
    ];
    msgs.forEach((m, i) => s.appendMessage({
      id: `demo-s4-m${i + 1}-${meId}`, roomId, senderId: m.senderId, content: m.content,
      createdAt: NOW - m.ageMs,
    }));
  }

  // ---------- S5: 雙方都 100%、慶祝過 (chat unlocked, celebrated) ----------
  {
    const partner = pickPartner(4);
    const book = "b-poetry";
    const roomId = `demo-s5-${meId}`;
    s.upsertRoom({
      id: roomId, postId: "demo-post-s5",
      userAId: partner, userBId: meId, bookId: book,
      createdAt: NOW - 30 * DAY,
      chatUnlockedAt: NOW - 25 * DAY, celebratedAt: NOW - 2 * DAY,
    });
    s.upsertProgress({ userId: meId, bookId: book, percent: 100, updatedAt: NOW - 3 * DAY });
    s.upsertProgress({ userId: partner, bookId: book, percent: 100, updatedAt: NOW - 2 * DAY });

    s.upsertNote({ id: `demo-s5-n1-${meId}`, userId: meId, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "詩比小說更需要時間留白", createdAt: NOW - 22 * DAY });
    s.upsertNote({ id: `demo-s5-n2-${meId}`, userId: meId, bookId: book, type: "free",
      content: "第十四首讀了三遍才懂", createdAt: NOW - 15 * DAY });
    s.upsertNote({ id: `demo-s5-n3-${meId}`, userId: meId, bookId: book, type: "milestone_100",
      prompt: "讀完之後最大的收穫？",
      content: "整本讀完反而想再讀一次。給 5 顆星。",
      createdAt: NOW - 3 * DAY });
    s.upsertNote({ id: `demo-s5-n4-${meId}`, userId: partner, bookId: book, type: "milestone_25",
      prompt: "目前你對這本書的感受？", content: "詩集對我有點距離，但這本意外好讀", createdAt: NOW - 21 * DAY });
    s.upsertNote({ id: `demo-s5-n5-${meId}`, userId: partner, bookId: book, type: "milestone_100",
      prompt: "讀完之後最大的收穫？",
      content: "謝謝你陪我讀完。給 4 顆星。",
      createdAt: NOW - 2 * DAY });

    const msgs: { senderId: string; content: string; ageMs: number }[] = [
      { senderId: partner, content: "今天進度怎樣？", ageMs: 20 * DAY },
      { senderId: meId,    content: "讀到第七首", ageMs: 20 * DAY - 30 * 1000 },
      { senderId: partner, content: "「夜把所有的鐘錶都磨亮了」這句你看到了嗎", ageMs: 18 * DAY },
      { senderId: meId,    content: "看到了，第三十二頁", ageMs: 18 * DAY - 2 * MIN },
      { senderId: partner, content: "我抄下來了", ageMs: 18 * DAY - MIN },
      { senderId: meId,    content: "我也是 :)", ageMs: 18 * DAY - 30 * 1000 },
      { senderId: partner, content: "讀完了！", ageMs: 3 * DAY },
      { senderId: meId,    content: "我也是、剛剛", ageMs: 3 * DAY - 2 * MIN },
      { senderId: partner, content: "好捨不得", ageMs: 2 * DAY },
    ];
    msgs.forEach((m, i) => s.appendMessage({
      id: `demo-s5-m${i + 1}-${meId}`, roomId, senderId: m.senderId, content: m.content,
      createdAt: NOW - m.ageMs,
    }));
  }
}
