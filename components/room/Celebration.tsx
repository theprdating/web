"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useFolioStore } from "@/lib/store";

export default function Celebration({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  const room = useFolioStore((s) => s.rooms[roomId]);
  const userA = useFolioStore((s) => room && s.users[room.userAId]);
  const userB = useFolioStore((s) => room && s.users[room.userBId]);
  const book  = useFolioStore((s) => room && s.books[room.bookId]);
  if (!room || !userA || !userB || !book) return null;

  const days = Math.ceil((Date.now() - room.createdAt) / 86_400_000);

  return (
    <motion.div className="fixed inset-0 bg-walnut/70 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-cream rounded-3xl overflow-hidden max-w-[420px] w-full text-center">
        <div className="relative w-full h-[280px]">
          <Image
            src="/illustrations/celebrate.png"
            alt="慶祝插圖"
            fill
            className="object-cover opacity-80"
          />
        </div>
        <div className="p-8">
          <h2 className="font-display text-3xl text-walnut">你們做到了</h2>
          <p className="text-walnut-soft mt-2">
            <span className="text-walnut">{userA.nickname}</span> 與 <span className="text-walnut">{userB.nickname}</span><br/>
            一起讀完了 《{book.title}》
          </p>
          <p className="text-walnut-soft text-sm mt-4">共讀 {days} 天</p>
          <div className="mt-8">
            <button onClick={onClose} className="bg-sage text-cream rounded-full py-3 px-8">收下這份紀念</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
