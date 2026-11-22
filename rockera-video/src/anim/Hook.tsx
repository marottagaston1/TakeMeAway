import React from 'react';
import {Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow} from '../fonts';
import {Backdrop} from './Backdrop';
import {Burger, burgerHeight} from './art';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const pop = Easing.bezier(0.34, 1.56, 0.64, 1);

// Gancho: tres hamburguesas ilustradas (1, 2 y 3 medallones) que saltan cuando la voz dice "una, dos, tres".
const HookInner: React.FC<{readonly cues: readonly number[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const S = 0.54;
  const yBase = 1270;
  const xs = [190, 540, 890];
  const amp = interpolate(frame, [0, 10], [12, 0], clamp);
  return (
    <>
      <Backdrop />
      <div style={{position: 'absolute', inset: 0, translate: `${Math.sin(frame * 4.4) * amp}px ${Math.cos(frame * 3.7) * amp}px`}}>
        {[1, 2, 3].map((n, i) => {
          const c = cues[i] ?? 0;
          const p = interpolate(frame, [c, c + 14], [0, 1], {...clamp, easing: pop});
          const bob = frame >= c + 14 ? Math.sin((frame - c) / 9 + i) * 6 : 0;
          const Hh = burgerHeight(n) + 20;
          return (
            <React.Fragment key={n}>
              <svg
                width={600 * S}
                height={Hh * S}
                viewBox={`0 0 600 ${Hh}`}
                style={{
                  position: 'absolute',
                  left: xs[i] - 300 * S,
                  top: yBase - Hh * S + bob,
                  overflow: 'visible',
                  transformOrigin: '50% 100%',
                  scale: p,
                  opacity: p > 0 ? 1 : 0,
                }}
              >
                <Burger patties={n} maskId={`hook${n}`} />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: xs[i] - 150,
                  width: 300,
                  top: yBase + 40,
                  display: 'flex',
                  justifyContent: 'center',
                  opacity: interpolate(frame, [c + 4, c + 12], [0, 1], clamp),
                  scale: interpolate(frame, [c + 4, c + 14], [0.6, 1], {...clamp, easing: pop}),
                }}
              >
                <Interactive.Div
                  name={`Etiqueta ${n}`}
                  style={{
                    fontFamily: barlow,
                    fontWeight: 700,
                    fontSize: 46,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#0b0b0b',
                    backgroundColor: '#ffb300',
                    border: '5px solid #1a0f0a',
                    padding: '4px 22px',
                    borderRadius: 18,
                    rotate: `${(i - 1) * 3}deg`,
                  }}
                >
                  <span style={{fontFamily: anton, fontSize: 54, marginRight: 8}}>{n}</span>
                  {n === 1 ? 'Medallón' : 'Medallones'}
                </Interactive.Div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export const Hook = Interactive.create({Component: HookInner, layout: 'absolute-fill'});
