import type { HTMLAttributes, ReactNode } from "react";

export type StatusVariant = "error" | "loading" | "info";

export interface StatusTextProps extends HTMLAttributes<HTMLSpanElement> {
  variant: StatusVariant;
  children: ReactNode;
}

function formatStatus(variant: StatusVariant, children: ReactNode): string {
  if (variant === "error") {
    return `[ERROR: ${children}]`;
  }
  if (variant === "loading") {
    return "[LOADING]";
  }
  return `[${children}]`;
}

export function StatusText({ variant, className, children, ...props }: StatusTextProps) {
  return (
    <span
      className={["ds-status", `ds-status--${variant}`, className].filter(Boolean).join(" ")}
      {...props}
    >
      {formatStatus(variant, children)}
    </span>
  );
}
