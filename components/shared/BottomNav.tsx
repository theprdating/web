"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Library, User } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/discover", label: "探索", Icon: Compass },
  { href: "/rooms",    label: "共讀", Icon: MessageCircle },
  { href: "/shelf",    label: "書櫃", Icon: Library },
  { href: "/me",       label: "我",   Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto bg-cream/95 backdrop-blur border-t border-tag/30 grid grid-cols-4 py-2">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={clsx(
          "flex flex-col items-center py-2 text-xs gap-1",
          pathname.startsWith(href) ? "text-sage" : "text-walnut-soft")}>
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
