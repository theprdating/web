"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageDots from "./PageDots";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    image: "/illustrations/intro-3.png",
    title: "在這裡找夥伴",
    body: "看別人想讀什麼書、決定要不要跟他一起。\n下方「探索」就是這裡。",
  },
  {
    image: "/illustrations/intro-4.png",
    title: "你自己的書櫃",
    body: "想自己讀也可以，記下進度跟心得。\n下方「書櫃」就是這裡。",
  },
  {
    image: "/illustrations/intro-2.png",
    title: "共讀室會解鎖",
    body: "配對成功 → 兩邊都讀到 25% + 寫下心得 → 解鎖聊天。\n從一段共同讀過的字句開始對話。",
  },
  {
    image: "/illustrations/celebrate.png",
    title: "打扮你的角色",
    body: "「我」頁面可以挑顏色、表情、體型。\n讀完一本書還會有共同紀念。",
  },
];

export default function Tutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <motion.div
      className="fixed inset-0 bg-walnut/40 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-cream rounded-2xl w-full max-w-[420px] p-6 shadow-xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-parchment mb-4">
              <Image src={slide.image} alt="" fill className="object-cover" />
            </div>
            <h3 className="font-display text-2xl text-walnut">{slide.title}</h3>
            <p className="text-walnut-soft text-sm mt-2 leading-relaxed whitespace-pre-line">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          <PageDots total={SLIDES.length} current={step} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button variant="ghost" onClick={onClose}>略過</Button>
          <Button onClick={() => isLast ? onClose() : setStep(step + 1)}>
            {isLast ? "完成" : "下一個"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
