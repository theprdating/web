import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export default function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full px-4 py-3 rounded-xl bg-cream border border-tag/40 text-walnut",
        "focus:outline-none focus:border-sage transition-colors",
        className
      )}
      {...rest}
    />
  );
}
