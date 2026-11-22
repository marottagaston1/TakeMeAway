import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow} from '../fonts';
import {BurgerStack} from './BurgerStack';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Tres cuadros "1 / 2 / 3 medallones" que se encienden en el frame de cada cue.
export const Tiles: React.FC<{readonly cues: readonly number[]; readonly top: number}> = ({cues, top}) => {
  const frame = useCurrentFrame();
  const fade = (start: number) => interpolate(frame, [start, start + 8], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        justifyContent: 'center',
        gap: 22,
      }}
    >
      {cues.map((c, i) => {
        const lit = frame >= c;
        return (
          <div
            key={i}
            style={{
              width: 300,
              height: 270,
              borderRadius: 28,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 18,
              boxSizing: 'border-box',
              backgroundColor: 'rgba(0,0,0,0.55)',
              border: `5px solid ${lit ? '#ffb300' : 'rgba(255,255,255,0.18)'}`,
              scale: lit ? interpolate(frame, [c, c + 8], [0.88, 1], {...clamp, easing: ease}) : 0.96,
              opacity: fade(2 + i * 3),
            }}
          >
            <div style={{opacity: lit ? 1 : 0.35, filter: lit ? undefined : 'grayscale(1)', marginBottom: 6}}>
              <BurgerStack patties={i + 1} />
            </div>
            <div
              style={{
                fontFamily: barlow,
                fontWeight: 700,
                fontSize: 44,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: lit ? '#ffb300' : 'rgba(245,236,217,0.55)',
              }}
            >
              <span style={{fontFamily: anton, fontSize: 52, marginRight: 8}}>{i + 1}</span>
              {i === 0 ? 'Medallón' : 'Medallones'}
            </div>
          </div>
        );
      })}
    </div>
  );
};
