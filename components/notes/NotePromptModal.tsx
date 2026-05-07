"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function NotePromptModal({
  open, onClose, prompts, requireOne, title, onSave, allowSkip = false,
}: {
  open: boolean; onClose: () => void;
  prompts: string[]; requireOne: boolean;
  title: string;
  onSave: (entries: { prompt: string; content: string }[]) => void;
  allowSkip?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const filled = Object.values(answers).filter((v) => v.trim()).length;
  const canSubmit = !requireOne || filled >= 1;

  const submit = () => {
    const entries = prompts.map((p, i) => ({ prompt: p, content: (answers[i] ?? "").trim() }))
      .filter((e) => e.content);
    onSave(entries);
  };

  return (
    <Modal open={open}>
      <h3 className="font-display text-xl text-walnut">{title}</h3>
      <p className="text-walnut-soft text-sm mt-1">至少答 1 題</p>

      <div className="space-y-4 mt-4">
        {prompts.map((p, i) => (
          <div key={i}>
            <div className="text-walnut text-sm mb-1">{p}</div>
            <Textarea value={answers[i] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))} />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {allowSkip ? (
          <Button variant="outline" onClick={onClose}>跳過</Button>
        ) : (
          <Button variant="outline" onClick={onClose}>稍後</Button>
        )}
        <Button onClick={submit} disabled={!canSubmit}>送出</Button>
      </div>
    </Modal>
  );
}
