import { PI } from "./cubeHeroConstants";

export type CubePhase = "construction" | "morph";

export interface Orientation {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface CubeHeroState {
  lastTickMs: number;
  construction: number;
  constructionStartedMs: number | null;
  phase: CubePhase;
  morphFrom: Orientation;
  morphTo: Orientation;
  morphSegmentStartMs: number | null;
  morphSegmentDuration: number;
  morphRngState: number;
  recentTargets: (Orientation | null)[];
  recentTargetIndex: number;
  rotationFrom: Orientation | null;
  lastRotationProgress: number;
  orientation: Orientation;
}

export function createCubeHeroState(nowMs = performance.now()): CubeHeroState {
  const base = baseOrientation();
  return {
    lastTickMs: nowMs,
    construction: 0,
    constructionStartedMs: nowMs,
    phase: "construction",
    morphFrom: base,
    morphTo: base,
    morphSegmentStartMs: null,
    morphSegmentDuration: MORPH_SEGMENT_DURATION_MAX,
    morphRngState: (Date.now() & 0xffffffff) || 0xa5a55a5a,
    recentTargets: [null, null, null, null],
    recentTargetIndex: 0,
    rotationFrom: null,
    lastRotationProgress: 0,
    orientation: base,
  };
}

export function createDockedCubeHeroState(nowMs = performance.now()): CubeHeroState {
  const header = headerOrientation();
  return {
    lastTickMs: nowMs,
    construction: 1,
    constructionStartedMs: null,
    phase: "morph",
    morphFrom: header,
    morphTo: header,
    morphSegmentStartMs: null,
    morphSegmentDuration: MORPH_SEGMENT_DURATION_MAX,
    morphRngState: 1,
    recentTargets: [null, null, null, null],
    recentTargetIndex: 0,
    rotationFrom: null,
    lastRotationProgress: 1,
    orientation: header,
  };
}

export function tickCubeHero(
  state: CubeHeroState,
  nowMs: number,
  rotationProgress: number,
): CubeHeroState {
  const next = { ...state };
  next.lastTickMs = nowMs;

  if (next.lastRotationProgress <= 0 && rotationProgress > 0) {
    next.rotationFrom = freeOrientation(next, nowMs);
    next.phase = "morph";
  }
  next.lastRotationProgress = rotationProgress;

  if (next.constructionStartedMs !== null) {
    next.construction = Math.min(
      1,
      (nowMs - next.constructionStartedMs) / CONSTRUCTION_DURATION_MS,
    );
  }

  if (rotationProgress <= 0) {
    if (
      next.construction >= MORPH_OVERLAP_START &&
      next.phase === "construction"
    ) {
      next.phase = "morph";
      beginMorphSegment(next, nowMs, true);
    } else if (next.phase === "morph") {
      advanceMorphIfNeeded(next, nowMs);
    }
  }

  next.orientation = computeOrientation(next, nowMs, rotationProgress);
  return next;
}

const CONSTRUCTION_DURATION_MS = 750;
const MORPH_OVERLAP_START = 0.72;
const MORPH_SEGMENT_OVERLAP = 0.88;
const MORPH_SEGMENT_DURATION_MIN = 0.3;
const MORPH_SEGMENT_DURATION_MAX = 0.58;
const MORPH_SEGMENT_IMMEDIATE_DURATION_MIN = 0.28;
const MORPH_SEGMENT_IMMEDIATE_DURATION_MAX = 0.5;

const BASE_YAW = 0.6;
const BASE_PITCH = 0.52;
const HEADER_YAW = PI / 4;
const HEADER_PITCH = Math.atan(1 / Math.sqrt(2));

const MORPH_YAW_RANGE: [number, number] = [0.12, 1.38];
const MORPH_PITCH_RANGE: [number, number] = [0.1, 0.82];
const MORPH_ROLL_RANGE: [number, number] = [-0.34, 0.34];

function baseOrientation(): Orientation {
  return { yaw: BASE_YAW, pitch: BASE_PITCH, roll: 0 };
}

function headerOrientation(): Orientation {
  return { yaw: HEADER_YAW, pitch: HEADER_PITCH, roll: 0 };
}

function beginMorphSegment(
  state: CubeHeroState,
  nowMs: number,
  immediate: boolean,
): void {
  const current = freeOrientation(state, nowMs);
  state.morphFrom = current;
  state.morphTo = pickMorphTarget(state, current, immediate);
  rememberTarget(state, state.morphTo);
  state.morphSegmentDuration = immediate
    ? rngRange(
        state,
        MORPH_SEGMENT_IMMEDIATE_DURATION_MIN,
        MORPH_SEGMENT_IMMEDIATE_DURATION_MAX,
      )
    : rngRange(state, MORPH_SEGMENT_DURATION_MIN, MORPH_SEGMENT_DURATION_MAX);
  state.morphSegmentStartMs = nowMs;
}

function pickMorphTarget(
  state: CubeHeroState,
  from: Orientation,
  immediate: boolean,
): Orientation {
  const minimumDelta = immediate ? 0.16 : 0.07;
  const historyGap = immediate ? 0.14 : 0.1;
  const bigSwing = rngChance(state, 0.22);
  const attempts = bigSwing ? 20 : 14;

  for (let i = 0; i < attempts; i += 1) {
    const candidate = rngOrientation(state);
    const delta = orientationDistance(candidate, from);
    if (bigSwing && delta < 0.28) continue;
    if (!bigSwing && delta < minimumDelta) continue;
    if (tooCloseToRecent(state, candidate, historyGap)) continue;
    return candidate;
  }

  const sign = rngChance(state, 0.5) ? 1 : -1;
  return {
    yaw: clamp(from.yaw + sign * 0.34, MORPH_YAW_RANGE[0], MORPH_YAW_RANGE[1]),
    pitch: clamp(
      from.pitch - sign * 0.18,
      MORPH_PITCH_RANGE[0],
      MORPH_PITCH_RANGE[1],
    ),
    roll: clamp(
      from.roll + sign * 0.22,
      MORPH_ROLL_RANGE[0],
      MORPH_ROLL_RANGE[1],
    ),
  };
}

function rememberTarget(state: CubeHeroState, target: Orientation): void {
  state.recentTargets[state.recentTargetIndex] = target;
  state.recentTargetIndex =
    (state.recentTargetIndex + 1) % state.recentTargets.length;
}

function tooCloseToRecent(
  state: CubeHeroState,
  candidate: Orientation,
  minimumGap: number,
): boolean {
  return state.recentTargets.some(
    (recent) =>
      recent !== null &&
      orientationDistance(candidate, recent) < minimumGap,
  );
}

function advanceMorphIfNeeded(state: CubeHeroState, nowMs: number): void {
  if (state.morphSegmentStartMs === null) {
    beginMorphSegment(state, nowMs, false);
    return;
  }
  const elapsed = nowMs - state.morphSegmentStartMs;
  if (elapsed >= state.morphSegmentDuration * 1000 * MORPH_SEGMENT_OVERLAP) {
    beginMorphSegment(state, nowMs, false);
  }
}

function freeOrientation(state: CubeHeroState, nowMs: number): Orientation {
  if (state.phase !== "morph" || state.morphSegmentStartMs === null) {
    return baseOrientation();
  }
  const t = easeInOut(
    clamp(
      (nowMs - state.morphSegmentStartMs) /
        (state.morphSegmentDuration * 1000),
      0,
      1,
    ),
  );
  return {
    yaw: lerp(state.morphFrom.yaw, state.morphTo.yaw, t),
    pitch: lerp(state.morphFrom.pitch, state.morphTo.pitch, t),
    roll: lerp(state.morphFrom.roll, state.morphTo.roll, t),
  };
}

function computeOrientation(
  state: CubeHeroState,
  nowMs: number,
  rotationProgress: number,
): Orientation {
  if (rotationProgress > 0) {
    const from = state.rotationFrom ?? freeOrientation(state, nowMs);
    const t = clamp(rotationProgress, 0, 1);
    return {
      yaw: lerp(from.yaw, HEADER_YAW, t),
      pitch: lerp(from.pitch, HEADER_PITCH, t),
      roll: lerp(from.roll, 0, t),
    };
  }
  return freeOrientation(state, nowMs);
}

function orientationDistance(a: Orientation, b: Orientation): number {
  return Math.abs(a.yaw - b.yaw) + Math.abs(a.pitch - b.pitch) + Math.abs(a.roll - b.roll);
}

function rngNext(state: CubeHeroState): number {
  let s = state.morphRngState;
  s ^= s << 13;
  s ^= s >> 17;
  s ^= s << 5;
  state.morphRngState = s >>> 0;
  return state.morphRngState;
}

function rngUnit(state: CubeHeroState): number {
  return rngNext(state) / 0xffffffff;
}

function rngRange(state: CubeHeroState, min: number, max: number): number {
  return min + (max - min) * rngUnit(state);
}

function rngChance(state: CubeHeroState, probability: number): boolean {
  return rngUnit(state) < clamp(probability, 0, 1);
}

function rngOrientation(state: CubeHeroState): Orientation {
  return {
    yaw: rngRange(state, MORPH_YAW_RANGE[0], MORPH_YAW_RANGE[1]),
    pitch: rngRange(state, MORPH_PITCH_RANGE[0], MORPH_PITCH_RANGE[1]),
    roll: rngRange(state, MORPH_ROLL_RANGE[0], MORPH_ROLL_RANGE[1]),
  };
}

function easeInOut(t: number): number {
  const c = clamp(t, 0, 1);
  if (c < 0.5) return 4 * c * c * c;
  return 1 - ((-2 * c + 2) ** 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
