import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow, marker} from '../fonts';
import {Scene3D} from './Scene3D';
import {H, labelOpacity, LAYERS, layerY, project, W} from './rig';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const LABEL_X = 600;

// Etiquetas y líneas: su posición sale de proyectar cada capa 3D a la pantalla.
const Labels: React.FC = () => {
  const frame = useCurrentFrame();
  const items = LAYERS.map((l) => {
    const y = layerY(frame, l) + l.mid;
    const c = project(frame, 0, y, 0);
    const edge = project(frame, l.radius, y, 0);
    return {l, c, edge, o: labelOpacity(frame, l)};
  });
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {items.map(({l, edge, c, o}) =>
          o > 0.01 ? (
            <g key={l.key} opacity={o}>
              <circle cx={edge.x} cy={c.y} r={7} fill="#e10600" />
              <line
                x1={edge.x}
                y1={c.y}
                x2={edge.x + (LABEL_X - 20 - edge.x) * Math.min(1, o * 1.4)}
                y2={c.y}
                stroke="#e10600"
                strokeWidth={3}
              />
            </g>
          ) : null,
        )}
      </svg>
      {items.map(({l, c, o}) =>
        o > 0.01 ? (
          <div
            key={l.key}
            style={{
              position: 'absolute',
              left: LABEL_X,
              top: c.y,
              translate: `${(1 - o) * 30}px -50%`,
              opacity: o,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <div
              style={{
                fontFamily: barlow,
                fontWeight: 700,
                fontSize: 50,
                lineHeight: 1,
                letterSpacing: 1,
                color: '#f5ecd9',
                textTransform: 'uppercase',
                textShadow: '0 3px 10px rgba(0,0,0,0.8)',
              }}
            >
              {l.name}
            </div>
            {l.sub ? (
              <div
                style={{
                  fontFamily: barlow,
                  fontWeight: 600,
                  fontSize: 32,
                  letterSpacing: 1,
                  color: '#ffb300',
                  textTransform: 'uppercase',
                  textShadow: '0 3px 10px rgba(0,0,0,0.8)',
                }}
              >
                {l.sub}
              </div>
            ) : null}
          </div>
        ) : null,
      )}
    </>
  );
};

export const Desarme: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, #3b130a 0%, #170907 55%, #070303 100%)',
        }}
      />
      <Scene3D />
      <Labels />

      <Interactive.Div
        name="Título 1"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 90,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 80,
          lineHeight: 1,
          letterSpacing: 4,
          color: '#f5ecd9',
          textTransform: 'uppercase',
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          translate: interpolate(frame, [0, 18], ['0px -60px', '0px 0px'], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Hamburguesa
      </Interactive.Div>
      <Interactive.Div
        name="Título 2"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 165,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 165,
          lineHeight: 1,
          color: '#e10600',
          textTransform: 'uppercase',
          textShadow: '0 0 60px rgba(225,6,0,0.55), 0 6px 0 #000',
          opacity: interpolate(frame, [6, 18], [0, 1], clamp),
          translate: interpolate(frame, [6, 24], ['0px -60px', '0px 0px'], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Rockera
      </Interactive.Div>

      <Interactive.Div
        name="Leyenda desarme"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 250,
          textAlign: 'center',
          fontFamily: marker,
          fontSize: 84,
          color: '#ffb300',
          rotate: '-4deg',
          opacity:
            interpolate(frame, [70, 85], [0, 1], clamp) * interpolate(frame, [320, 335], [1, 0], clamp),
        }}
      >
        así se arma
      </Interactive.Div>

      <Interactive.Div
        name="Cierre"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 250,
          textAlign: 'center',
          fontFamily: marker,
          fontSize: 130,
          color: '#ffb300',
          rotate: '-4deg',
          opacity: interpolate(frame, [548, 550], [0, 1], clamp),
          scale: interpolate(frame, [548, 562], [2.2, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
        }}
      >
        ¡Probala!
      </Interactive.Div>
    </>
  );
};
