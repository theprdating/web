import Image from "next/image";
import type { Avatar as AvatarType, AvatarExpression, AvatarHeight, AvatarWeight } from "@/lib/store";

const DEFAULT: AvatarType = { base: "sage" };

function getTransform(height: AvatarHeight, weight: AvatarWeight): string {
  const scaleY = height === "short" ? 0.9 : height === "tall" ? 1.08 : 1.0;
  const scaleX = weight === "slim" ? 0.92 : weight === "chubby" ? 1.1 : 1.0;
  if (scaleX === 1.0 && scaleY === 1.0) return "none";
  return `scaleX(${scaleX}) scaleY(${scaleY})`;
}

function ExpressionOverlay({ expression }: { expression: AvatarExpression }) {
  if (expression === "default") return null;

  // Eye-mask ovals to blot out original PNG dot eyes
  // Larger ovals ensure coverage across slight per-base position variation
  const maskLeft = <ellipse cx="370" cy="245" rx="32" ry="28" fill="#F8E8D0" />;
  const maskRight = <ellipse cx="430" cy="245" rx="32" ry="28" fill="#F8E8D0" />;

  let leftEye: React.ReactNode;
  let rightEye: React.ReactNode;

  if (expression === "happy") {
    // Upward arc curves (smiling eyes)
    leftEye = <path d="M352,250 Q370,232 388,250" stroke="#3D2F1F" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
    rightEye = <path d="M412,250 Q430,232 448,250" stroke="#3D2F1F" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  } else if (expression === "sleepy") {
    // Short horizontal lines
    leftEye = <line x1="356" y1="245" x2="384" y2="245" stroke="#3D2F1F" strokeWidth="3.5" strokeLinecap="round" />;
    rightEye = <line x1="416" y1="245" x2="444" y2="245" stroke="#3D2F1F" strokeWidth="3.5" strokeLinecap="round" />;
  } else if (expression === "surprise") {
    // Larger circles
    leftEye = <circle cx="370" cy="245" r="26" fill="#3D2F1F" />;
    rightEye = <circle cx="430" cy="245" r="26" fill="#3D2F1F" />;
  } else if (expression === "wink") {
    // Left eye = circle, right eye = arc (wink)
    leftEye = <circle cx="370" cy="245" r="18" fill="#3D2F1F" />;
    rightEye = <path d="M412,250 Q430,232 448,250" stroke="#3D2F1F" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  } else {
    return null;
  }

  return (
    <svg
      viewBox="0 0 800 1000"
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 2 }}
    >
      {maskLeft}
      {maskRight}
      {leftEye}
      {rightEye}
    </svg>
  );
}

export default function Avatar({ avatar = DEFAULT, size = 240 }: { avatar?: AvatarType; size?: number }) {
  const canvasHeight = Math.round(size * 1.25); // 4:5 aspect (800:1000)

  const height: AvatarHeight = avatar.height ?? "regular";
  const weight: AvatarWeight = avatar.weight ?? "regular";
  const expression: AvatarExpression = avatar.expression ?? "default";

  const transform = getTransform(height, weight);

  return (
    <div className="relative mx-auto" style={{ width: size, height: canvasHeight }}>
      {avatar.bg && (
        <Image
          src={`/illustrations/avatar/wardrobe/bg-${avatar.bg}.png`}
          alt=""
          fill
          className="object-contain"
          style={{ zIndex: 0 }}
        />
      )}
      {/* Base wrapped in transform layer for height/weight */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          transform,
          transformOrigin: "bottom center",
        }}
      >
        <Image
          src={`/illustrations/avatar/base-${avatar.base}.png`}
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <ExpressionOverlay expression={expression} />
    </div>
  );
}
