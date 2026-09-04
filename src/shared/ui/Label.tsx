import type { HTMLAttributes, ReactNode } from "react";

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <span className={["ds-label", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}
