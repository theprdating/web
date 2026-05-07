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
  stanceChangedAt: number;
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

export type State = {
  currentUserId: string | null;
  users: Record<string, User>;
  books: Record<string, Book>;
  posts: Record<string, Post>;
  applications: Record<string, Application>;
  rooms: Record<string, Room>;
  notes: Record<string, Note>;
  progress: Record<string, Progress>;
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
