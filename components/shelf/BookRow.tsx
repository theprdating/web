"use client";
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
