export const PI = Math.PI;

/** Canvas margin so rotated cube vertices and strokes are not clipped. */
export const CUBE_HERO_EDGE_INSET = 28;

export const VERTICES: ReadonlyArray<readonly [number, number, number]> = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

export const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export const DASHED_EDGE_INDICES = new Set([6, 7, 11]);

export const VERTEX_PHASE_END = 0.35;
export const EDGE_PHASE_START = 0.2;
