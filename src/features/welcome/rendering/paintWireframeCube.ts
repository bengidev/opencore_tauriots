import type { Orientation } from "../domain/cubeHeroState";
import {
  CUBE_HERO_EDGE_INSET,
  DASHED_EDGE_INDICES,
  EDGES,
  EDGE_PHASE_START,
  VERTEX_PHASE_END,
  VERTICES,
} from "../domain/cubeHeroConstants";

export interface PaintWireframeCubeOptions {
  construction: number;
  orientation: Orientation;
  rotationProgress: number;
  ink: string;
}

function easeOut(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - (1 - c) ** 3;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function projectVertex(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  half: number,
  orientation: Orientation,
): [number, number] {
  const { yaw, pitch, roll } = orientation;
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const x3 = x1 * Math.cos(roll) - y2 * Math.sin(roll);
  const y3 = x1 * Math.sin(roll) + y2 * Math.cos(roll);
  return [centerX + x3 * half, centerY + y3 * half];
}

function vertexOpacity(index: number, construction: number): number {
  const vertexProgress = Math.min(1, construction / VERTEX_PHASE_END);
  const delay = index * 0.025;
  const normalizedDelay = delay / VERTEX_PHASE_END;
  const linear = Math.max(
    0,
    Math.min(1, (vertexProgress - normalizedDelay) / (1 - normalizedDelay)),
  );
  return easeOut(linear);
}

function edgeStrokeEnd(index: number, construction: number): number {
  const edgeSpan = Math.max(0.001, 1 - EDGE_PHASE_START);
  const edgeProgress = Math.max(
    0,
    Math.min(1, (construction - EDGE_PHASE_START) / edgeSpan),
  );
  let linear: number;
  if (DASHED_EDGE_INDICES.has(index)) {
    linear = Math.max(0, Math.min(1, (edgeProgress - 0.35) / 0.65));
  } else {
    const delay = index * 0.05;
    linear = Math.max(0, Math.min(1, (edgeProgress - delay) / (1 - delay)));
  }
  return easeOut(linear);
}

export function paintWireframeCube(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: PaintWireframeCubeOptions,
): void {
  const { construction, orientation, rotationProgress, ink } = options;
  const compact = Math.min(width, height) <= 28;
  const docked = Math.min(width, height) <= 18;
  const canvasPadding = docked
    ? 1
    : compact
      ? 4
      : 10 + CUBE_HERO_EDGE_INSET;
  const drawableSide = Math.max(1, Math.min(width, height) - canvasPadding * 2);
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const half = drawableSide * (docked ? 0.42 : compact ? 0.38 : 0.32);
  const constructionActive = construction < 1 && rotationProgress <= 0;
  const strokeWidth = docked ? 1 : compact ? 1.25 : 2;
  const vertexRadius = docked ? 1 : compact ? 1.5 : 3.5;

  const projected = VERTICES.map(([x, y, z]) =>
    projectVertex(x, y, z, centerX, centerY, half, orientation),
  );

  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineCap = "round";

  for (let index = 0; index < EDGES.length; index += 1) {
    const [start, end] = EDGES[index];
    const strokeEnd = constructionActive
      ? edgeStrokeEnd(index, construction)
      : 1;
    if (strokeEnd <= 0) continue;

    const [sx, sy] = projected[start];
    const [ex, ey] = projected[end];
    const tx = lerp(sx, ex, Math.min(1, strokeEnd));
    const ty = lerp(sy, ey, Math.min(1, strokeEnd));

    ctx.beginPath();
    ctx.setLineDash(
      DASHED_EDGE_INDICES.has(index)
        ? docked
          ? [2, 1.5]
          : compact
            ? [2.5, 2]
            : [4, 3]
        : [],
    );
    ctx.lineWidth = strokeWidth;
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  ctx.setLineDash([]);

  for (let index = 0; index < projected.length; index += 1) {
    const [vx, vy] = projected[index];
    if (constructionActive) {
      const opacity = vertexOpacity(index, construction);
      if (opacity <= 0) continue;
      const scale = 0.85 + 0.15 * opacity;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(vx, vy, scale * vertexRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.beginPath();
      ctx.arc(vx, vy, vertexRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
