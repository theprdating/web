import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  children: ReactNode;
};

export default function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        "w-full py-4 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-sage text-cream hover:bg-sage-dark",
        variant === "ghost" && "text-walnut hover:bg-cream",
        variant === "outline" && "border border-tag text-walnut hover:bg-cream",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
