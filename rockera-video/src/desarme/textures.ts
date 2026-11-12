import * as THREE from 'three';

const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const cache = new Map<string, THREE.CanvasTexture>();

const make = (
  key: string,
  w: number,
  h: number,
  color: boolean,
  draw: (ctx: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture => {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo crear el canvas 2D');
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  cache.set(key, tex);
  return tex;
};

const S = 1024;

// Costra de queso parmesano sobre el pan (vista cenital: el UV es planar).
const drawCrust = (ctx: CanvasRenderingContext2D, mode: 'color' | 'bump') => {
  const r = rng(11);
  if (mode === 'color') {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#efc06c');
    g.addColorStop(0.7, '#e3a850');
    g.addColorStop(1, '#c98a3a');
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = '#303030';
  }
  ctx.fillRect(0, 0, S, S);

  for (let i = 0; i < 5000; i++) {
    const x = r() * S;
    const y = r() * S;
    const v = r();
    ctx.fillStyle =
      mode === 'color'
        ? v > 0.5
          ? 'rgba(255,225,150,0.25)'
          : 'rgba(150,90,30,0.2)'
        : v > 0.5
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(0,0,0,0.15)';
    ctx.fillRect(x, y, 2 + r() * 3, 2 + r() * 3);
  }

  const palette = ['#c98a2e', '#b8691d', '#dba043', '#a95a1a'];
  for (let i = 0; i < 420; i++) {
    const rr = Math.sqrt(r()) * S * 0.48;
    const phi = r() * Math.PI * 2;
    const x0 = S / 2 + Math.cos(phi) * rr;
    const y0 = S / 2 + Math.sin(phi) * rr;
    const ang = r() * Math.PI * 2;
    const len = 60 + r() * 120;
    const bend = (r() - 0.5) * 60;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(
      x0 + Math.cos(ang) * len * 0.5 - Math.sin(ang) * bend,
      y0 + Math.sin(ang) * len * 0.5 + Math.cos(ang) * bend,
      x0 + Math.cos(ang) * len,
      y0 + Math.sin(ang) * len,
    );
    ctx.lineCap = 'round';
    ctx.lineWidth = 12 + r() * 16;
    ctx.strokeStyle = mode === 'color' ? palette[Math.floor(r() * palette.length)] : 'rgba(255,255,255,0.85)';
    ctx.stroke();
  }
};

export const crustMap = () => make('crust', S, S, true, (c) => drawCrust(c, 'color'));
export const crustBump = () => make('crustBump', S, S, false, (c) => drawCrust(c, 'bump'));

// Pan inferior: dorado liso con miga fina.
export const plainBunMap = () =>
  make('plainBun', 512, 512, true, (ctx) => {
    const r = rng(5);
    ctx.fillStyle = '#dfa955';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = r() > 0.5 ? 'rgba(255,230,160,0.25)' : 'rgba(150,90,30,0.2)';
      ctx.fillRect(r() * 512, r() * 512, 2 + r() * 3, 2 + r() * 3);
    }
  });

// Medallón: carne sellada con puntos de costra.
const drawPatty = (ctx: CanvasRenderingContext2D, mode: 'color' | 'bump') => {
  const r = rng(23);
  ctx.fillStyle = mode === 'color' ? '#5a3321' : '#505050';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const v = r();
    if (mode === 'color') {
      ctx.fillStyle = v > 0.66 ? '#7a4a2c' : v > 0.2 ? '#3e2113' : '#1c0e09';
    } else {
      ctx.fillStyle = v > 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    }
    const s = 1 + r() * 4;
    ctx.fillRect(r() * 512, r() * 512, s, s);
  }
};
export const pattyMap = () => make('patty', 512, 512, true, (c) => drawPatty(c, 'color'));
export const pattyBump = () => make('pattyBump', 512, 512, false, (c) => drawPatty(c, 'bump'));

// Panceta: tiras de carne rosada y grasa blanca con bordes tostados.
export const baconMap = () =>
  make('bacon', 512, 128, true, (ctx) => {
    const r = rng(41);
    const bands: [number, string][] = [
      [0.07, '#8a3329'],
      [0.14, '#f1d9d0'],
      [0.2, '#c8626a'],
      [0.1, '#f4e1d8'],
      [0.2, '#c25a63'],
      [0.12, '#f1d9d0'],
      [0.10, '#b9505a'],
      [0.07, '#8a3329'],
    ];
    let y = 0;
    for (const [h, c] of bands) {
      ctx.fillStyle = c;
      ctx.fillRect(0, y * 128, 512, h * 128 + 1);
      y += h;
    }
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(80,20,20,0.15)';
      ctx.fillRect(r() * 512, r() * 128, 3 + r() * 6, 1);
    }
  });

// Tabla de madera oscura (como la de las fotos).
export const woodMap = () =>
  make('wood', 1024, 1024, true, (ctx) => {
    const r = rng(77);
    ctx.fillStyle = '#2a190f';
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 260; i++) {
      const y = r() * 1024;
      ctx.strokeStyle = r() > 0.5 ? 'rgba(80,50,30,0.35)' : 'rgba(10,5,3,0.4)';
      ctx.lineWidth = 1 + r() * 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(300, y + (r() - 0.5) * 40, 700, y + (r() - 0.5) * 40, 1024, y + (r() - 0.5) * 20);
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      const x = r() * 1024;
      const y = r() * 1024;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (r() - 0.5) * 160, y + (r() - 0.5) * 160);
      ctx.stroke();
    }
  });
