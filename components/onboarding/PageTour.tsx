"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFolioStore } from "@/lib/store";
import Button from "@/components/ui/Button";

type Step = {
  route: string;
  title: string;
  body: string;
  hint?: string; // small grey caption pointing at where to look
};

const STEPS: Step[] = [
  {
    route: "/discover",
    title: "這是「探索」",
    body: "別人想找夥伴共讀的書都在這裡。\n滑下去看看有什麼書 + 是誰發的。",
    hint: "下方第一個 tab 就是這頁",
  },
  {
    route: "/discover",
    title: "想找人共讀？",
    body: "右上角「＋ 發帖」貼出你的書、為什麼想讀、想找怎樣的夥伴。",
    hint: "點右上角試試看",
  },
  {
    route: "/discover/mine",
    title: "你發的貼文都在這",
    body: "每篇看誰申請了、可以接受 / 拒絕 / 關閉貼文。\n收到申請會在這裡用綠色標出來。",
    hint: "下方第二個 tab「貼文」",
  },
  {
    route: "/rooms",
    title: "配對成功 → 共讀室",
    body: "接受申請後就會在這裡看到。\n聊天要等雙方都讀到 25% + 寫完心得才解鎖。",
    hint: "下方第三個 tab「共讀」",
  },
  {
    route: "/shelf",
    title: "你的書櫃",
    body: "個人讀書記錄。可以單獨加書、寫便利貼，不用一定要找人。\n讀完一本書會自動產生整理頁可分享。",
    hint: "下方第四個 tab「書櫃」",
  },
  {
    route: "/me",
    title: "「我」的頁面",
    body: "編輯角色（顏色 / 表情 / 身高 / 胖瘦）、看閱讀統計、調整心態。\n隨時可改，但部分欄位有冷卻期。",
    hint: "下方最右邊 tab「我」",
  },
];

export default function PageTour() {
  const pathname = usePathname();
  const router = useRouter();
  const tourStep = useFolioStore((s) => s.tourStep);
  const setTourStep = useFolioStore((s) => s.setTourStep);
  const meId = useFolioStore((s) => s.currentUserId);
  const me = useFolioStore((s) => meId ? s.users[meId] : null);
  const upsertUser = useFolioStore((s) => s.upsertUser);

  // Navigate to current step's route when step changes
  useEffect(() => {
    if (tourStep === null) return;
    const step = STEPS[tourStep];
    if (step && pathname !== step.route) {
      router.push(step.route);
    }
  }, [tourStep, pathname, router]);

  if (tourStep === null) return null;
  const step = STEPS[tourStep];
  if (!step) return null;
  const isLast = tourStep === STEPS.length - 1;

  const dismiss = () => {
    setTourStep(null);
    if (me && !me.tutorialSeenAt) {
      upsertUser({ ...me, tutorialSeenAt: Date.now() });
    }
  };

  const advance = () => {
    if (isLast) dismiss();
    else setTourStep(tourStep + 1);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tourStep}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-0 bottom-20 max-w-[480px] mx-auto z-40 px-4 pointer-events-none"
      >
        <div className="bg-cream rounded-2xl p-5 shadow-xl border border-tag/40 pointer-events-auto">
          <div className="flex justify-between items-center">
            <span className="text-walnut-soft text-xs">教學 {tourStep + 1} / {STEPS.length}</span>
            {step.hint && <span className="text-sage text-xs">→ {step.hint}</span>}
          </div>
          <h3 className="font-display text-xl text-walnut mt-2">{step.title}</h3>
          <p className="text-walnut-soft text-sm mt-2 leading-relaxed whitespace-pre-line">{step.body}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="ghost" onClick={dismiss}>略過</Button>
            <Button onClick={advance}>{isLast ? "完成" : "下一個 →"}</Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
