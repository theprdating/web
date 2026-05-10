"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Inbox, MessageCircle, Library, User } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/discover",      label: "探索", Icon: Compass,        matchPrefix: "/discover" },
  { href: "/discover/mine", label: "貼文", Icon: Inbox,          matchPrefix: "/discover/mine" },
  { href: "/rooms",         label: "共讀", Icon: MessageCircle,  matchPrefix: "/rooms" },
  { href: "/shelf",         label: "書櫃", Icon: Library,        matchPrefix: "/shelf" },
  { href: "/me",            label: "我",   Icon: User,           matchPrefix: "/me" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // pick the most specific matching prefix (so /discover/mine wins over /discover)
  const activeHref = ITEMS
    .filter((it) => pathname.startsWith(it.matchPrefix))
    .sort((a, b) => b.matchPrefix.length - a.matchPrefix.length)[0]?.href;

  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-[480px] mx-auto bg-cream/95 backdrop-blur border-t border-tag/30 grid grid-cols-5 py-2">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={clsx(
          "flex flex-col items-center py-2 text-xs gap-1",
          activeHref === href ? "text-sage" : "text-walnut-soft")}>
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
