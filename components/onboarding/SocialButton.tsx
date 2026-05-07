import { ReactNode } from "react";

export default function SocialButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full py-4 rounded-full bg-cream border border-tag/60 flex items-center justify-center gap-3 text-walnut hover:bg-tag/10 transition-colors">
      {icon}
      <span>{label}</span>
    </button>
  );
}
