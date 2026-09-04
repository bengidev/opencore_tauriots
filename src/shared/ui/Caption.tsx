import type { HTMLAttributes, ReactNode } from "react";

export interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p";
  children: ReactNode;
}

export function Caption({ as: Tag = "span", className, children, ...props }: CaptionProps) {
  return (
    <Tag className={["ds-caption", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}
