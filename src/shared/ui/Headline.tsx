import type { HTMLAttributes, ReactNode } from "react";

export interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4" | "p";
  children: ReactNode;
}

export function Headline({ as: Tag = "h2", className, children, ...props }: HeadlineProps) {
  return (
    <Tag className={["ds-headline", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}
