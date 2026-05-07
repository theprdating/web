"use client";
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
