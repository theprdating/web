import { ReactNode } from "react";

export default function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`min-h-screen px-6 py-8 ${className}`}>{children}</main>;
}
