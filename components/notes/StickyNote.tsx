"use client";
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
