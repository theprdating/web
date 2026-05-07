"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, children }: { open: boolean; onClose?: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-walnut/40 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-cream rounded-2xl w-full max-w-[420px] p-6 shadow-xl"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
