import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonSize = "sm" | "md";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: IconButtonSize;
  icon: ReactNode;
  pressed?: boolean;
  "aria-label": string;
}

export function IconButton({
  size,
  icon,
  pressed,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={["ds-icon-button", `ds-icon-button--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...props}
    >
      {icon}
    </button>
  );
}
