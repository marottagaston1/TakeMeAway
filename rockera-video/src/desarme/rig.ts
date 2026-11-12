import {Easing, interpolate} from 'remotion';
import * as THREE from 'three';

export const W = 1080;
export const H = 1920;
export const FOV = 32;

// Momentos clave (frames @30fps)
const EXPLODE_START = 50; // empiezan a separarse las capas
const REASSEMBLE_START = 335; // empiezan a volver a armarse
const SPIN_START = 432;
const SPIN_END = 545;

export type LayerKey =
  | 'bottom'
  | 'sauce'
  | 'patty'
  | 'cheese'
  | 'onion'
  | 'bacon'
  | 'egg'
  | 'top';

export type LayerDef = {
  readonly key: LayerKey;
  readonly base: number; // altura de la capa armada
  readonly mid: number; // centro visual sobre la base (para etiquetas)
  readonly lift: number; // cuánto sube al desarmarse
  readonly outDelay: number;
  readonly inDelay: number;
  readonly radius: number;
  readonly name: string;
  readonly sub: string;
  readonly labelAt: number;
  readonly phase: number;
};

export const LAYERS: readonly LayerDef[] = [
  {key: 'bottom', base: 0, mid: 0.27, lift: 0, outDelay: 0, inDelay: 0, radius: 1.72, name: 'Pan de papa', sub: '', labelAt: 232, phase: 0},
  {key: 'sauce', base: 0.55, mid: 0.03, lift: 0.5, outDelay: 30, inDelay: 0, radius: 1.5, name: 'Salsa especial', sub: '', labelAt: 200, phase: 1.1},
  {key: 'patty', base: 0.61, mid: 0.2, lift: 1.1, outDelay: 25, inDelay: 7, radius: 1.5, name: 'Medallón de carne', sub: '', labelAt: 100, phase: 2.3},
  {key: 'cheese', base: 1.04, mid: 0, lift: 1.7, outDelay: 20, inDelay: 14, radius: 1.7, name: 'Cheddar', sub: '', labelAt: 120, phase: 3.4},
  {key: 'onion', base: 1.07, mid: 0.15, lift: 2.3, outDelay: 15, inDelay: 21, radius: 1.2, name: 'Cebolla caramelizada', sub: '', labelAt: 160, phase: 4.2},
  {key: 'bacon', base: 1.3, mid: 0.06, lift: 2.9, outDelay: 10, inDelay: 28, radius: 1.5, name: 'Panceta', sub: '', labelAt: 140, phase: 5.1},
  {key: 'egg', base: 1.4, mid: 0.06, lift: 3.5, outDelay: 5, inDelay: 35, radius: 1.5, name: 'Huevo frito', sub: '', labelAt: 180, phase: 0.7},
  {key: 'top', base: 1.56, mid: 0.55, lift: 4.6, outDelay: 0, inDelay: 42, radius: 1.72, name: 'Pan de papa', sub: 'con chispas de parmesano', labelAt: 220, phase: 1.9},
];

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 = armada, 1 = completamente separada.
export const explodeAmount = (f: number, l: LayerDef): number => {
  const out = interpolate(f, [EXPLODE_START + l.outDelay, EXPLODE_START + l.outDelay + 40], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const back = interpolate(f, [REASSEMBLE_START + l.inDelay, REASSEMBLE_START + l.inDelay + 34], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.34, 1.1, 0.64, 1),
  });
  return out * (1 - back);
};

export const layerY = (f: number, l: LayerDef): number => {
  const e = explodeAmount(f, l);
  const bob = Math.sin(f / 14 + l.phase) * 0.07 * Math.min(1, Math.max(0, e)) * (l.lift > 0 ? 1 : 0);
  return l.base + l.lift * e + bob;
};

export const layerRotY = (f: number, l: LayerDef): number => {
  const e = Math.min(1, Math.max(0, explodeAmount(f, l)));
  return Math.sin(f / 18 + l.phase) * 0.5 * e;
};

export const groupRotY = (f: number): number =>
  interpolate(f, [0, 50], [-0.6, 0], {...clampOpts, easing: Easing.out(Easing.cubic)}) +
  Math.PI *
    2 *
    interpolate(f, [SPIN_START, SPIN_END], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});

export const labelOpacity = (f: number, l: LayerDef): number => {
  const inn = interpolate(f, [l.labelAt, l.labelAt + 10], [0, 1], clampOpts);
  const out = interpolate(f, [REASSEMBLE_START + l.inDelay - 26, REASSEMBLE_START + l.inDelay - 12], [1, 0], clampOpts);
  return inn * out;
};

export const zoomAt = (f: number): number => {
  const zin = interpolate(f, [EXPLODE_START - 6, 115], [0, 1], {...clampOpts, easing: Easing.bezier(0.22, 1, 0.36, 1)});
  const zout = interpolate(f, [REASSEMBLE_START, 420], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.cubic)});
  return zin * (1 - zout);
};

export type Cam = {
  readonly pos: readonly [number, number, number];
  readonly look: readonly [number, number, number];
};

export const camAt = (f: number): Cam => {
  const z = zoomAt(f);
  const dist = 15 + 8 * z;
  const lookY = 1.25 + 2.25 * z;
  const lookX = 1.5 * z;
  const spinP = interpolate(f, [SPIN_START, SPIN_END], [0, 1], clampOpts);
  const el = ((14 + 10 * z + 9 * Math.sin(Math.PI * spinP)) * Math.PI) / 180;
  return {
    pos: [lookX, lookY + Math.sin(el) * dist, Math.cos(el) * dist],
    look: [lookX, lookY, 0],
  };
};

const projCam = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 100);

// Proyecta un punto del mundo 3D a píxeles del video (para las etiquetas).
export const project = (f: number, x: number, y: number, z: number): {x: number; y: number} => {
  const c = camAt(f);
  projCam.position.set(c.pos[0], c.pos[1], c.pos[2]);
  projCam.lookAt(c.look[0], c.look[1], c.look[2]);
  projCam.updateMatrixWorld(true);
  projCam.updateProjectionMatrix();
  const v = new THREE.Vector3(x, y, z).project(projCam);
  return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H};
};
