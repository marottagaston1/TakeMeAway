import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, marker} from '../fonts';
import {Backdrop} from './Backdrop';
import {Burger, burgerHeight, buildLayers, type LayerKey} from './art';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const GAP = 96;

export type StageMarks = {
  readonly explode: number;
  readonly items: readonly number[]; // medallón, cheddar, panceta, cebolla, huevo, salsa, pan
  readonly siete: number;
  readonly bocado: number;
  readonly hamburguesa: number;
};

const ITEMS: {key: LayerKey; l1: string; l2: string; size: number}[] = [
  {key: 'patty', l1: 'Medallón', l2: 'de carne', size: 56},
  {key: 'cheese', l1: 'Cheddar', l2: '', size: 60},
  {key: 'bacon', l1: 'Panceta', l2: '', size: 60},
  {key: 'onion', l1: 'Cebolla', l2: 'caramelizada', size: 44},
  {key: 'egg', l1: 'Huevo', l2: 'frito', size: 60},
  {key: 'sauce', l1: 'Salsa', l2: 'especial', size: 60},
  {key: 'top', l1: 'Pan de papa', l2: 'con parmesano', size: 40},
];

const Sparks: React.FC<{readonly x: number; readonly y: number; readonly p: number}> = ({x, y, p}) => {
  if (p <= 0 || p >= 1) return null;
  const colors = ['#ffb300', '#e10600', '#f5ecd9'];
  return (
    <>
      {Array.from({length: 12}, (_, k) => {
        const a = (k / 12) * Math.PI * 2;
        const d = 40 + 150 * (1 - Math.pow(1 - p, 3));
        const r = 14 * (1 - p) + 2;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * d - r,
              top: y + Math.sin(a) * d - r,
              width: 2 * r,
              height: 2 * r,
              borderRadius: k % 2 ? '50%' : 3,
              rotate: `${k * 30}deg`,
              backgroundColor: colors[k % 3],
              border: '2px solid #1a0f0a',
            }}
          />
        );
      })}
    </>
  );
};

// La hamburguesa cae, se desarma, resalta cada ingrediente con la voz, se rearma, recibe un mordisco y queda como título.
const StageInner: React.FC<{readonly marks: StageMarks}> = ({marks}) => {
  const f = useCurrentFrame();
  const Hh = burgerHeight(1) + 20;
  const layers = buildLayers(1);

  const drop = interpolate(f, [0, 18], [-900, 0], {...clamp, easing: Easing.bezier(0.34, 1.4, 0.64, 1)});
  const ex = interpolate(f, [marks.explode, marks.explode + 32], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const asm = interpolate(f, [marks.siete, marks.siete + 12], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const e = ex * (1 - asm);

  const titleP = interpolate(f, [marks.hamburguesa, marks.hamburguesa + 14], [0, 1], {...clamp, easing: ease});
  const S = interpolate(e, [0, 1], [1, 0.8]) * interpolate(titleP, [0, 1], [1, 0.55]);
  const yBase = interpolate(titleP, [0, 1], [interpolate(e, [0, 1], [1330, 1560]), 960]) + drop;

  // rebote al caer las capas
  const land = marks.siete + 12;
  const t = f - land;
  const bump = t >= 0 ? Math.exp(-t / 5) * Math.cos(t / 2.2) : 0;
  const sx = 1 + 0.08 * bump;
  const sy = 1 - 0.14 * bump;

  // ingrediente activo
  let active = -1;
  marks.items.forEach((m, i) => {
    if (f >= m) active = i;
  });
  const showHl = f < marks.siete && active >= 0;
  const hlKey = showHl ? ITEMS[active].key : null;
  const hlFrame = showHl ? f - marks.items[active] : 0;
  const popV = interpolate(hlFrame, [0, 5, 12], [0, 1, 0.7], clamp);

  const bite = interpolate(f, [marks.bocado, marks.bocado + 8], [0, 1], {...clamp, easing: ease});
  const top = yBase - Hh * S;
  const left = 540 - 300 * S;
  const topLayer = layers[layers.length - 1];
  const biteX = left + 560 * S;
  const biteY = top + (Hh - topLayer.z - topLayer.h + 60 - e * GAP * topLayer.order) * S;

  const amp = interpolate(f - marks.hamburguesa, [0, 24], [22, 0], clamp);
  const shake = `${Math.sin(f * 5.3) * amp}px ${Math.cos(f * 4.7) * amp}px`;

  const layerY = (key: LayerKey) => {
    const l = layers.find((x) => x.key === key) ?? layers[0];
    return top + (Hh - l.z - l.h / 2 - e * GAP * l.order) * S;
  };

  return (
    <>
      <Backdrop />
      <AbsoluteFill style={{translate: shake}}>
        <svg
          width={600 * S}
          height={Hh * S}
          viewBox={`0 0 600 ${Hh}`}
          style={{position: 'absolute', left, top, overflow: 'visible', transformOrigin: '50% 100%', scale: `${sx} ${sy}`}}
        >
          <Burger patties={1} explode={e} gap={GAP} highlight={hlKey} pop={popV} bite={bite} maskId="stagebite" />
        </svg>

        {marks.items.map((m, i) => {
          if (f < m || f >= marks.siete + 2 || (marks.items[i + 1] !== undefined && f >= marks.items[i + 1])) return null;
          return <Sparks key={`s${i}`} x={540} y={layerY(ITEMS[i].key)} p={(f - m) / 16} />;
        })}

        {showHl && e > 0.5 ? (
          <div
            style={{
              position: 'absolute',
              top: layerY(ITEMS[active].key),
              left: active % 2 === 0 ? 24 : 796,
              width: 260,
              translate: `${(1 - interpolate(hlFrame, [0, 12], [0, 1], {...clamp, easing: ease})) * (active % 2 === 0 ? -300 : 300)}px -50%`,
              textAlign: active % 2 === 0 ? 'right' : 'left',
            }}
          >
            <Interactive.Div
              name="Etiqueta de ingrediente"
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(0,0,0,0.62)',
                border: '5px solid #ffb300',
                borderRadius: 20,
                padding: '8px 18px 10px',
                rotate: active % 2 === 0 ? '-3deg' : '3deg',
              }}
            >
              <div style={{fontFamily: marker, fontSize: 34, color: '#ffb300', lineHeight: 1}}>
                {String(active + 1).padStart(2, '0')} / 07
              </div>
              <div style={{fontFamily: anton, fontSize: ITEMS[active].size, lineHeight: 1.02, color: '#f5ecd9', textTransform: 'uppercase'}}>
                {ITEMS[active].l1}
              </div>
              {ITEMS[active].l2 ? (
                <div style={{fontFamily: anton, fontSize: ITEMS[active].size, lineHeight: 1.02, color: '#e10600', textTransform: 'uppercase'}}>
                  {ITEMS[active].l2}
                </div>
              ) : null}
            </Interactive.Div>
          </div>
        ) : null}

        {f >= marks.bocado ? (
          <>
            <Sparks x={biteX} y={biteY} p={(f - marks.bocado) / 18} />
            <Interactive.Div
              name="Ñam"
              style={{
                position: 'absolute',
                left: biteX - 40,
                top: biteY - 150,
                fontFamily: marker,
                fontSize: 120,
                color: '#ffb300',
                textShadow: '0 5px 0 #1a0f0a',
                rotate: '8deg',
                opacity: interpolate(f - marks.bocado, [0, 4, 30, 40], [0, 1, 1, 0], clamp),
                scale: interpolate(f - marks.bocado, [0, 10], [0.4, 1], {...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1)}),
              }}
            >
              ¡ñam!
            </Interactive.Div>
          </>
        ) : null}

        {titleP > 0 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Interactive.Div
              name="Título 1"
              style={{
                fontFamily: anton,
                fontSize: 120,
                lineHeight: 1,
                letterSpacing: 4,
                color: '#f5ecd9',
                textTransform: 'uppercase',
                textShadow: '0 6px 0 #1a0f0a',
                translate: interpolate(f - marks.hamburguesa, [0, 14], ['-700px 0px', '0px 0px'], {...clamp, easing: ease}),
              }}
            >
              Hamburguesa
            </Interactive.Div>
            <Interactive.Div
              name="Título 2"
              style={{
                fontFamily: anton,
                fontSize: 250,
                lineHeight: 1,
                color: '#e10600',
                textTransform: 'uppercase',
                textShadow: '0 0 60px rgba(225,6,0,0.6), 0 8px 0 #1a0f0a',
                opacity: interpolate(f - marks.hamburguesa, [8, 9], [0, 1], clamp),
                scale: interpolate(f - marks.hamburguesa, [9, 19], [2.6, 1], {...clamp, easing: ease, output: 'perceptual-scale'}),
              }}
            >
              Rockera
            </Interactive.Div>
          </div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(f - marks.hamburguesa, [9, 13, 24], [0, 0.65, 0], clamp),
        }}
      />
    </>
  );
};

export const Stage = Interactive.create({Component: StageInner, layout: 'absolute-fill'});
