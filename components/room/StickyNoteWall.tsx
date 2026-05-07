"use client";
import { useFolioStore } from "@/lib/store";
import StickyNote from "@/components/notes/StickyNote";

export default function StickyNoteWall({ bookId, userIds }: { bookId: string; userIds: string[] }) {
  const allNotes = useFolioStore((s) => s.notes);
  const notes = Object.values(allNotes)
    .filter((n) => n.bookId === bookId && userIds.includes(n.userId))
    .sort((a, b) => b.createdAt - a.createdAt);
  if (notes.length === 0) {
    return <div className="text-walnut-soft text-sm text-center py-6">還沒有便利貼。</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {notes.map((n) => <StickyNote key={n.id} noteId={n.id} />)}
    </div>
  );
}
