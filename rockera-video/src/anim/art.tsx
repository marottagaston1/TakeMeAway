import React from 'react';
import {random} from 'remotion';

// Ilustración vectorial de la hamburguesa, capa por capa (contorno grueso, colores planos).
export const INK = '#1a0f0a';

export type LayerKey = 'bottom' | 'sauce' | 'patty' | 'cheese' | 'onion' | 'bacon' | 'egg' | 'top';
export type LayerInfo = {readonly id: string; readonly key: LayerKey; readonly z: number; readonly h: number; readonly order: number};

const H: Record<LayerKey, number> = {bottom: 104, sauce: 38, patty: 96, cheese: 56, onion: 62, bacon: 54, egg: 70, top: 200};
const PAIR = 110; // lo que suma cada medallón extra (con su queso)

// Lista de capas de abajo hacia arriba para N medallones.
export const buildLayers = (patties: number): LayerInfo[] => {
  const out: LayerInfo[] = [];
  let order = 0;
  const push = (id: string, key: LayerKey, z: number) => out.push({id, key, z, h: H[key], order: order++});
  push('bottom', 'bottom', 0);
  push('sauce', 'sauce', 86);
  for (let i = 0; i < patties; i++) {
    push(`patty${i}`, 'patty', 110 + i * PAIR);
    push(`cheese${i}`, 'cheese', 186 + i * PAIR);
  }
  const extra = (patties - 1) * PAIR;
  push('onion', 'onion', 226 + extra);
  push('bacon', 'bacon', 268 + extra);
  push('egg', 'egg', 304 + extra);
  push('top', 'top', 342 + extra);
  return out;
};

export const burgerHeight = (patties: number) => 342 + (patties - 1) * PAIR + H.top;

const o = {stroke: INK, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Top: React.FC = () => {
  const dome = 'M 20 190 C 12 70, 120 6, 300 6 C 480 6, 588 70, 580 190 Q 580 200 560 200 L 40 200 Q 20 200 20 190 Z';
  const chips = Array.from({length: 16}, (_, i) => ({
    x: 70 + random(`cx${i}`) * 460,
    y: 40 + random(`cy${i}`) * 130,
    r: (random(`cr${i}`) - 0.5) * 80,
  }));
  return (
    <g>
      <clipPath id="topclip"><path d={dome} /></clipPath>
      <path d={dome} fill="#e9a443" />
      <g clipPath="url(#topclip)">
        <rect x={0} y={165} width={600} height={40} fill="#c9822a" />
        {[[120, 90, 70], [380, 60, 60], [470, 130, 55], [210, 140, 45]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.55} fill="#d98b2c" opacity={0.7} />
        ))}
        {chips.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width={46} height={13} rx={6.5} fill="#fff0b8" stroke="#c9822a" strokeWidth={3} transform={`rotate(${c.r} ${c.x + 23} ${c.y + 6})`} />
        ))}
        <ellipse cx={190} cy={52} rx={74} ry={20} fill="#fff" opacity={0.32} transform="rotate(-18 190 52)" />
      </g>
      <path d={dome} fill="none" {...o} strokeWidth={8} />
    </g>
  );
};

const Egg: React.FC = () => (
  <g>
    <path
      d="M 40 40 C 10 20, 60 4, 120 12 C 180 -4, 260 8, 310 10 C 380 0, 470 6, 520 18 C 590 30, 600 58, 540 62 C 480 72, 420 60, 360 66 C 290 72, 240 62, 180 66 C 110 70, 60 64, 40 40 Z"
      fill="#fffaf0"
      {...o}
      strokeWidth={7}
    />
    <circle cx={330} cy={36} r={30} fill="#ffb300" {...o} strokeWidth={6} />
    <circle cx={319} cy={25} r={8} fill="#fff" opacity={0.85} />
  </g>
);

const Bacon: React.FC = () => {
  const ribbon = (dy: number, x0: number, x1: number, fill: string) => {
    const w = (x1 - x0) / 8;
    let top = `M ${x0} ${20 + dy}`;
    let bot = '';
    for (let i = 0; i < 8; i++) {
      const x = x0 + i * w;
      top += ` Q ${x + w / 2} ${(i % 2 ? 36 : 4) + dy} ${x + w} ${20 + dy}`;
    }
    for (let i = 7; i >= 0; i--) {
      const x = x0 + i * w;
      bot += ` Q ${x + w / 2} ${(i % 2 ? 56 : 24) + dy} ${x} ${40 + dy}`;
    }
    return (
      <g>
        <path d={`${top} L ${x1} ${40 + dy}${bot} Z`} fill={fill} {...o} strokeWidth={6} />
        <path d={`M ${x0 + 10} ${30 + dy} ${Array.from({length: 8}, (_, i) => `Q ${x0 + 10 + i * w + w / 2} ${(i % 2 ? 44 : 12) + dy} ${x0 + 10 + (i + 1) * w} ${30 + dy}`).join(' ')}`} fill="none" stroke="#f3b9b0" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      </g>
    );
  };
  return <g>{ribbon(0, 4, 596, '#d9525a')}{ribbon(10, 60, 540, '#c4414b')}</g>;
};

const Onion: React.FC = () => {
  const arcs = [[60, 44, 34, 0], [150, 40, 30, 1], [244, 46, 36, 0], [340, 38, 30, 1], [432, 44, 34, 0], [524, 40, 30, 1]];
  return (
    <g fill="none" strokeLinecap="round">
      {arcs.map(([x, y, r, flip], i) => {
        const d = flip ? `M ${x} ${y} a ${r} ${r} 0 0 0 ${2 * r} 0` : `M ${x} ${y} a ${r} ${r} 0 0 1 ${2 * r} 0`;
        return (
          <g key={i}>
            <path d={d} stroke={INK} strokeWidth={34} />
            <path d={d} stroke="#c9792a" strokeWidth={20} />
            <path d={d} stroke="#e8a24a" strokeWidth={6} transform="translate(0 -3)" />
          </g>
        );
      })}
    </g>
  );
};

const Cheese: React.FC = () => (
  <g>
    <path
      d="M 0 8 H 600 V 24 Q 600 30 590 30 H 566 V 48 Q 566 54 554 54 Q 542 54 542 48 V 30 H 120 V 40 Q 120 46 110 46 Q 100 46 100 40 V 30 H 14 Q 0 30 0 24 Z"
      fill="#ffc21a"
      {...o}
      strokeWidth={6}
    />
    <path d="M 30 17 H 300" stroke="#ffe27a" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Patty: React.FC = () => {
  const dots = Array.from({length: 26}, (_, i) => ({x: 40 + random(`px${i}`) * 520, y: 18 + random(`py${i}`) * 62, d: random(`pd${i}`) > 0.5}));
  return (
    <g>
      <rect x={10} y={6} width={580} height={84} rx={38} fill="#5b2f1d" {...o} strokeWidth={7} />
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.d ? 5 : 3.5} fill={p.d ? '#7b4429' : '#3a1c10'} />
      ))}
      <path d="M 44 26 Q 64 14 130 15" stroke="#8a5133" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Sauce: React.FC = () => (
  <g>
    <path
      d="M 20 4 H 580 Q 596 4 596 14 Q 596 22 580 22 H 540 V 30 Q 540 36 530 36 Q 520 36 520 30 V 22 H 220 V 32 Q 220 38 210 38 Q 200 38 200 32 V 22 H 20 Q 4 22 4 14 Q 4 4 20 4 Z"
      fill="#ee8f5e"
      {...o}
      strokeWidth={6}
    />
    <path d="M 40 11 H 260" stroke="#f6b085" strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Bottom: React.FC = () => (
  <g>
    <clipPath id="botclip"><path d="M 10 10 H 590 V 62 Q 590 104 540 104 H 60 Q 10 104 10 62 Z" /></clipPath>
    <path d="M 10 10 H 590 V 62 Q 590 104 540 104 H 60 Q 10 104 10 62 Z" fill="#e9a443" />
    <g clipPath="url(#botclip)">
      <rect x={0} y={10} width={600} height={16} fill="#f3c06a" />
      <rect x={0} y={78} width={600} height={34} fill="#c9822a" />
    </g>
    <path d="M 10 10 H 590 V 62 Q 590 104 540 104 H 60 Q 10 104 10 62 Z" fill="none" {...o} strokeWidth={8} />
  </g>
);

export const LayerArt: React.FC<{readonly layerKey: LayerKey}> = ({layerKey}) => {
  switch (layerKey) {
    case 'top': return <Top />;
    case 'egg': return <Egg />;
    case 'bacon': return <Bacon />;
    case 'onion': return <Onion />;
    case 'cheese': return <Cheese />;
    case 'patty': return <Patty />;
    case 'sauce': return <Sauce />;
    default: return <Bottom />;
  }
};

// Hamburguesa completa. explode (0-1) separa las capas hacia arriba; highlight resalta una capa por tipo.
export const Burger: React.FC<{
  readonly patties: number;
  readonly explode?: number;
  readonly gap?: number;
  readonly highlight?: LayerKey | null;
  readonly pop?: number; // 0-1: intensidad del "salto" de la capa resaltada
  readonly dim?: number; // opacidad de las capas no resaltadas
  readonly bite?: number; // 0-1: mordisco arriba a la derecha
  readonly maskId?: string;
}> = ({patties, explode = 0, gap = 96, highlight = null, pop = 0, dim = 0.4, bite = 0, maskId = 'bite'}) => {
  const layers = buildLayers(patties);
  const total = burgerHeight(patties);
  const Hh = total + 20;
  const topLayer = layers[layers.length - 1];
  const biteY = Hh - topLayer.z - topLayer.h + 70 - explode * gap * topLayer.order;
  return (
    <>
      <defs>
        <filter id={`${maskId}-sticker`} x="-4%" y="-40%" width="108%" height="180%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="d" />
          <feFlood floodColor="#f5ecd9" />
          <feComposite in2="d" operator="in" result="o" />
          <feMerge>
            <feMergeNode in="o" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-200} y={-1500} width={1000} height={4000}>
          <rect x={-200} y={-1500} width={1000} height={4000} fill="white" />
          {bite > 0 ? (
            <>
              <circle cx={560} cy={biteY - 10} r={78 * bite} fill="black" />
              <circle cx={494} cy={biteY - 36} r={58 * bite} fill="black" />
              <circle cx={592} cy={biteY + 70} r={62 * bite} fill="black" />
            </>
          ) : null}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {layers.map((l) => {
          const y = Hh - l.z - l.h - explode * gap * l.order;
          const on = highlight === l.key;
          const s = on ? 1 + 0.2 * pop : 1;
          const cx = 300;
          const cy = y + l.h / 2;
          return (
            <g
              key={l.id}
              opacity={highlight && !on ? dim : 1}
              filter={`url(#${maskId}-sticker)`}
              transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy}) translate(0 ${y})`}
            >
              <LayerArt layerKey={l.key} />
            </g>
          );
        })}
      </g>
    </>
  );
};
