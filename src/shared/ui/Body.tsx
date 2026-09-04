import type { HTMLAttributes, ReactNode } from "react";

export interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span";
  children: ReactNode;
}

export function Body({ as: Tag = "p", className, children, ...props }: BodyProps) {
  return (
    <Tag className={["ds-body", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}
