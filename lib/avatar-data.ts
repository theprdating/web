import type { AvatarBase, AvatarHat, AvatarHolding, AvatarScarf, AvatarBg } from "./store";

export const AVATAR_BASES: { id: AvatarBase; label: string }[] = [
  { id: "sage", label: "鼠尾草" },
  { id: "lavender", label: "薰衣草" },
  { id: "amber", label: "暖駝" },
  { id: "rose", label: "柔粉" },
  { id: "fog", label: "霧藍" },
  { id: "walnut", label: "核桃" },
];

export const AVATAR_HATS: { id: AvatarHat; label: string }[] = [
  { id: "beret-sage", label: "貝雷帽" },
  { id: "flower-crown", label: "花環" },
  { id: "wool-amber", label: "針織帽" },
];

export const AVATAR_HOLDINGS: { id: AvatarHolding; label: string }[] = [
  { id: "book-open-cream", label: "翻開的書" },
  { id: "book-closed-sage", label: "合上的書" },
  { id: "tea-cup", label: "熱茶" },
  { id: "pen-quill", label: "羽毛筆" },
];

export const AVATAR_SCARVES: { id: AvatarScarf; label: string }[] = [
  { id: "lavender", label: "薰衣草色" },
  { id: "stripes", label: "細條紋" },
];

export const AVATAR_BGS: { id: AvatarBg; label: string }[] = [
  { id: "bookshelf-mini", label: "迷你書櫃" },
  { id: "window-moon", label: "月夜窗" },
  { id: "window-sun", label: "晴日窗" },
];
