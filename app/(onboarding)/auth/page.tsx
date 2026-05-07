"use client";
import { useRouter } from "next/navigation";
import { useFolioStore } from "@/lib/store";
import SocialButton from "@/components/onboarding/SocialButton";

export default function Auth() {
  const router = useRouter();
  const setCurrentUser = useFolioStore((s) => s.setCurrentUser);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  const startNewUser = () => {
    const id = `user-${Date.now()}`;
    upsertUser({
      id, nickname: "", gender: "", age: 0,
      bookCategories: [], qaAnswers: {},
      stance: "純粹書友",
      stanceChangedAt: 0, nicknameChangedAt: 0,
    });
    setCurrentUser(id);
    router.push("/register/basic");
  };

  const useDemoUser = () => {
    setCurrentUser("alice");
    router.push("/discover");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-4">
      <h1 className="font-display text-5xl text-walnut mb-2">Folio</h1>
      <p className="text-walnut-soft mb-8 text-center">登入以開始你的閱讀旅程</p>

      <div className="w-full space-y-3">
        <SocialButton icon={<span></span>} label="使用 Google 登入" onClick={startNewUser} />
        <SocialButton icon={<span></span>} label="使用 Apple 登入"  onClick={startNewUser} />
        <button onClick={useDemoUser}
          className="w-full text-walnut-soft text-sm underline pt-4">以「Alice」 demo 帳號繼續</button>
      </div>
    </main>
  );
}
