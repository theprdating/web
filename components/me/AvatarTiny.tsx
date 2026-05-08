import Image from "next/image";
import type { Avatar } from "@/lib/store";
import clsx from "clsx";

const DEFAULT_BASE = "sage" as const;

export default function AvatarTiny({ avatar, size = 40, className = "" }: {
  avatar?: Avatar; size?: number; className?: string;
}) {
  const base = avatar?.base ?? DEFAULT_BASE;
  return (
    <div
      style={{ width: size, height: size }}
      className={clsx("relative rounded-full overflow-hidden bg-parchment border border-tag/40 shrink-0", className)}
    >
      <Image
        src={`/illustrations/avatar/base-${base}.png`}
        alt=""
        fill
        sizes="60px"
        style={{ objectFit: "cover", objectPosition: "center top" }}
      />
    </div>
  );
}
