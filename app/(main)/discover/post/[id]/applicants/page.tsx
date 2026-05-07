"use client";
import { useParams, useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import StanceBadge from "@/components/feed/StanceBadge";

export default function Applicants() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const post = useFolioStore((s) => s.posts[id]);
  const allApps = useFolioStore((s) => s.applications);
  const users = useFolioStore((s) => s.users);
  const apps = Object.values(allApps).filter((a) => a.postId === id);
  const upsertApplication = useFolioStore((s) => s.upsertApplication);
  const upsertPost = useFolioStore((s) => s.upsertPost);
  const upsertRoom = useFolioStore((s) => s.upsertRoom);

  if (!post) return null;

  const closePost = () => {
    upsertPost({ ...post, status: "closed" });
    router.push("/discover");
  };

  const accept = (appId: string) => {
    const app = useFolioStore.getState().applications[appId];
    if (!app) return;
    const roomId = `r-${Date.now()}`;
    upsertRoom({
      id: roomId, postId: post.id,
      userAId: post.ownerId, userBId: app.applicantId,
      bookId: post.bookId,
      createdAt: Date.now(), chatUnlockedAt: null, celebratedAt: null,
    });
    upsertApplication({ ...app, status: "accepted" });
    router.push(`/room/${roomId}`);
  };
  const reject = (appId: string) => {
    const app = useFolioStore.getState().applications[appId];
    if (!app) return;
    upsertApplication({ ...app, status: "rejected" });
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-walnut">申請者</h1>
        {post.status === "open" ? (
          <button onClick={closePost} className="text-walnut-soft text-sm underline">關閉貼文</button>
        ) : (
          <span className="text-walnut-soft text-sm">已關閉</span>
        )}
      </div>

      {apps.length === 0 && <div className="text-walnut-soft">還沒有人申請。</div>}

      <div className="space-y-3">
        {apps.map((a) => {
          const u = users[a.applicantId];
          if (!u) return null;
          return (
            <div key={a.id} className="p-5 rounded-2xl bg-cream border border-tag/30">
              <div className="flex justify-between items-start gap-2">
                <div className="font-display text-lg text-walnut">{u.nickname} ・ {a.progressAtApply}%</div>
                <StanceBadge stance={u.stance} />
              </div>
              <p className="text-walnut text-sm mt-3 whitespace-pre-line">{a.whyRead}</p>
              <p className="text-walnut-soft text-sm mt-2"><span className="font-medium">能成為：</span>{a.selfOffer}</p>

              {a.status === "pending" ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="outline" onClick={() => reject(a.id)}>拒絕</Button>
                  <Button onClick={() => accept(a.id)}>接受</Button>
                </div>
              ) : (
                <div className="mt-3 text-sage text-sm">已 {a.status === "accepted" ? "接受" : "拒絕"}</div>
              )}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
