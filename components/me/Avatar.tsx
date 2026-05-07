import Image from "next/image";
import type { Avatar as AvatarType } from "@/lib/store";

const DEFAULT: AvatarType = { base: "sage" };

export default function Avatar({ avatar = DEFAULT, size = 240 }: { avatar?: AvatarType; size?: number }) {
  const height = Math.round(size * 1.25); // 4:5 aspect (800:1000)
  return (
    <div className="relative mx-auto" style={{ width: size, height }}>
      {avatar.bg && (
        <Image src={`/illustrations/avatar/wardrobe/bg-${avatar.bg}.png`} alt="" fill className="object-contain" style={{ zIndex: 0 }} />
      )}
      <Image src={`/illustrations/avatar/base-${avatar.base}.png`} alt="" fill className="object-contain" style={{ zIndex: 1 }} />
      {avatar.scarf && (
        <Image src={`/illustrations/avatar/wardrobe/scarf-${avatar.scarf}.png`} alt="" fill className="object-contain" style={{ zIndex: 2 }} />
      )}
      {avatar.holding && (
        <Image src={`/illustrations/avatar/wardrobe/${avatar.holding}.png`} alt="" fill className="object-contain" style={{ zIndex: 3 }} />
      )}
      {avatar.bookmark && (
        <Image src="/illustrations/avatar/wardrobe/bookmark-tab.png" alt="" fill className="object-contain" style={{ zIndex: 4 }} />
      )}
      {avatar.hat && (
        <Image src={`/illustrations/avatar/wardrobe/hat-${avatar.hat}.png`} alt="" fill className="object-contain" style={{ zIndex: 5 }} />
      )}
      {avatar.glasses && (
        <Image src="/illustrations/avatar/wardrobe/glasses-round.png" alt="" fill className="object-contain" style={{ zIndex: 6 }} />
      )}
    </div>
  );
}
