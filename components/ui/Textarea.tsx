import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export default function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full px-4 py-3 rounded-xl bg-cream border border-tag/40 text-walnut",
        "focus:outline-none focus:border-sage transition-colors min-h-[100px] resize-none",
        className
      )}
      {...rest}
    />
  );
}
