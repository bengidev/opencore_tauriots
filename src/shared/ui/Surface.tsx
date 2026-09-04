import type { HTMLAttributes, ReactNode } from "react";

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Surface({ className, children, ...props }: SurfaceProps) {
  return (
    <div className={["ds-surface", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}
