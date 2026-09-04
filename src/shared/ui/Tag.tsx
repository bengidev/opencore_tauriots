import type { HTMLAttributes, ReactNode } from "react";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  children: ReactNode;
}

export function Tag({ active, className, children, ...props }: TagProps) {
  return (
    <span
      className={[
        "ds-tag",
        active ? "ds-tag--active" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
