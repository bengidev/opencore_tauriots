import type { HTMLAttributes, ReactNode } from "react";

export type StatusVariant = "error" | "loading" | "info";

export interface StatusTextProps extends HTMLAttributes<HTMLSpanElement> {
  variant: StatusVariant;
  children: ReactNode;
}

export function StatusText({ variant, className, children, ...props }: StatusTextProps) {
  const prefix =
    variant === "error" ? "[ERROR: " : variant === "loading" ? "[LOADING" : "[";
  const suffix = variant === "loading" ? "]" : variant === "error" ? "]" : "]";

  return (
    <span
      className={["ds-status", `ds-status--${variant}`, className].filter(Boolean).join(" ")}
      {...props}
    >
      {variant === "error" ? `${prefix}${children}${suffix}` : variant === "loading" ? "[LOADING]" : `[${children}]`}
    </span>
  );
}
