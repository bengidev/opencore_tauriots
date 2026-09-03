import { useCallback, useEffect, useRef } from "react";
import {
  createCubeHeroState,
  tickCubeHero,
  type CubeHeroState,
} from "../domain/cubeHeroState";
import {
  foreground,
  foregroundRgb,
  lerpForegroundRgb,
  THEME_TRANSITION_MS,
  type ThemeMode,
} from "../domain/welcomeTheme";
import { paintWireframeCube } from "../rendering/paintWireframeCube";

export interface WelcomeCubeHeroCanvasProps {
  mode: ThemeMode;
  className?: string;
  size?: number;
  animate?: boolean;
  initialState?: CubeHeroState;
}

function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width: rect.width, height: rect.height };
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function WelcomeCubeHeroCanvas({
  mode,
  className,
  size,
  animate = true,
  initialState,
}: WelcomeCubeHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubeStateRef = useRef<CubeHeroState>(
    initialState ?? createCubeHeroState(),
  );
  const modeRef = useRef(mode);
  const inkFromRef = useRef(foregroundRgb(mode, "primary"));
  const inkToRef = useRef(foregroundRgb(mode, "primary"));
  const inkTransitionStartRef = useRef<number | null>(null);

  useEffect(() => {
    const previousMode = modeRef.current;
    if (mode === previousMode) return;
    inkFromRef.current = foregroundRgb(previousMode, "primary");
    inkToRef.current = foregroundRgb(mode, "primary");
    inkTransitionStartRef.current = prefersReducedMotion()
      ? null
      : performance.now();
    modeRef.current = mode;
  }, [mode]);

  const resolveInk = useCallback(
    (nowMs: number): string => {
      const start = inkTransitionStartRef.current;
      if (start === null) return foreground(mode, "primary");
      const t = Math.min(1, (nowMs - start) / THEME_TRANSITION_MS);
      if (t >= 1) {
        inkTransitionStartRef.current = null;
        return foreground(mode, "primary");
      }
      return lerpForegroundRgb(inkFromRef.current, inkToRef.current, t);
    },
    [mode],
  );

  const isInkTransitioning = useCallback((nowMs: number): boolean => {
    const start = inkTransitionStartRef.current;
    return start !== null && nowMs - start < THEME_TRANSITION_MS;
  }, []);

  const paint = useCallback(
    (nowMs = performance.now()) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = fitCanvas(canvas, ctx);
      ctx.clearRect(0, 0, width, height);
      paintWireframeCube(ctx, width, height, {
        construction: cubeStateRef.current.construction,
        orientation: cubeStateRef.current.orientation,
        ink: resolveInk(nowMs),
      });
    },
    [resolveInk],
  );

  useEffect(() => {
    let frame = 0;
    const loop = (nowMs: number) => {
      if (animate) {
        cubeStateRef.current = tickCubeHero(cubeStateRef.current, nowMs);
      }
      paint(nowMs);
      const cubeAnimating =
        animate &&
        (cubeStateRef.current.construction < 1 ||
          cubeStateRef.current.phase === "morph");
      if (cubeAnimating || isInkTransitioning(nowMs)) {
        frame = window.requestAnimationFrame(loop);
      }
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, isInkTransitioning, paint]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "welcome-cube-hero"}
      role="img"
      aria-label="Animated wireframe cube"
      style={size ? { width: size, height: size } : undefined}
    />
  );
}
