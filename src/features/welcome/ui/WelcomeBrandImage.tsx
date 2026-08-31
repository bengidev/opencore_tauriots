import {
  BRAND_IMAGE_DARK,
  BRAND_IMAGE_LIGHT,
} from "../domain/welcomeConstants";
import type { ThemeMode } from "../domain/welcomeTheme";

export interface WelcomeBrandImageProps {
  mode: ThemeMode;
  height: number;
  opacity?: number;
  className?: string;
}

export function WelcomeBrandImage({
  mode,
  height,
  opacity = 1,
  className,
}: WelcomeBrandImageProps) {
  const src = mode === "light" ? BRAND_IMAGE_LIGHT : BRAND_IMAGE_DARK;
  const width = height * (848 / 202);

  return (
    <img
      src={src}
      alt="OpenCore"
      className={className}
      style={{
        height,
        width,
        opacity,
        flexShrink: 0,
        objectFit: "contain",
      }}
    />
  );
}
