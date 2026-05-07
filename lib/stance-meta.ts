import type { Stance } from "./store";

export const STANCE_META: Record<Stance, { label: string; sub: string }> = {
  "純粹書友":     { label: "純粹書友",     sub: "想找一起讀書的朋友，不想多" },
  "純粹找緣分":   { label: "純粹找緣分",   sub: "想以書為媒，認識更深的關係" },
  "不拘":         { label: "不拘",         sub: "都好，看跟誰讀什麼書"     },
};
