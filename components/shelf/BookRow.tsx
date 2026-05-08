"use client";
import Link from "next/link";
import { useFolioStore } from "@/lib/store";

const SPINE_TONES = ["bg-sage/60", "bg-lavender/60", "bg-amber-300/60", "bg-rose-300/60", "bg-fog/60", "bg-walnut/40"];

function BookSpine({ bookId }: { bookId: string }) {
  const tone = SPINE_TONES[bookId.charCodeAt(bookId.length - 1) % SPINE_TONES.length];
  return (
    <div className={`w-2.5 h-14 ${tone} rounded-sm relative shrink-0`}>
      <div className="absolute inset-x-0 top-2 h-px bg-walnut/15" />
      <div className="absolute inset-x-0 bottom-2 h-px bg-walnut/15" />
    </div>
  );
}

export default function BookRow({ bookId, percent }: { bookId: string; percent: number }) {
  const book = useFolioStore((s) => s.books[bookId]);
  if (!book) return null;
  return (
    <Link href={`/shelf/${book.id}`}
      className="flex items-center gap-3 bg-cream border border-tag/30 rounded-xl px-4 py-3 hover:border-sage transition-colors">
      <BookSpine bookId={book.id} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <div className="font-display text-lg text-walnut truncate">{book.title}</div>
          <div className="font-display text-sage shrink-0">{percent}%</div>
        </div>
        <div className="h-1 bg-tag/30 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-sage" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </Link>
  );
}
