import type { HTMLAttributes, ReactNode } from "react";

export interface DisplayProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
}

export function Display({ as: Tag = "h1", className, children, ...props }: DisplayProps) {
  return (
    <Tag className={["ds-display", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}
