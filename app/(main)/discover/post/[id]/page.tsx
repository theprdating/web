"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StanceBadge from "@/components/feed/StanceBadge";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post  = useFolioStore((s) => s.posts[id]);
  const owner = useFolioStore((s) => post && s.users[post.ownerId]);
  const book  = useFolioStore((s) => post && s.books[post.bookId]);
  const meId  = useFolioStore((s) => s.currentUserId);

  if (!post || !owner || !book) return null;
  const isMine = meId === post.ownerId;

  return (
    <PageContainer>
      <Link href="/discover" className="text-sage text-sm">← 回探索</Link>
      <div className="mt-4 flex justify-between items-start">
        <h1 className="font-display text-3xl text-walnut">{book.title}</h1>
        <StanceBadge stance={owner.stance} />
      </div>
      <div className="text-walnut-soft text-sm mt-1">{owner.nickname} ・ 目前 {post.progressAtPost}%</div>

      <Field label="為什麼想讀">{post.whyRead}</Field>
      <Field label="期待對方">{post.partnerExpectation}</Field>
      <Field label="預期週數">{post.expectedWeeks} 週</Field>

      {!isMine ? (
        <div className="mt-8">
          <Link href={`/apply/${post.id}`}><Button>我要申請</Button></Link>
        </div>
      ) : (
        <div className="mt-8">
          <Link href={`/discover/post/${post.id}/applicants`}><Button>查看申請者</Button></Link>
        </div>
      )}
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="text-walnut-soft text-xs">{label}</div>
      <div className="text-walnut mt-1 leading-relaxed">{children}</div>
    </div>
  );
}
