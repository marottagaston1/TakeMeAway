import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow} from '../fonts';
import {KenBurns} from '../KenBurns';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Los tres números se encienden en el frame de cada cue (cuando la voz dice "uno", "dos" y "tres").
const CtaCardInner: React.FC<{readonly photo: string; readonly cues: readonly number[]}> = ({photo, cues}) => {
  const frame = useCurrentFrame();
  const labels = ['Medallón', 'Medallones', 'Medallones'];
  const rise = (start: number) => interpolate(frame, [start, start + 14], ['0px 60px', '0px 0px'], {...clamp, easing: ease});
  const fade = (start: number) => interpolate(frame, [start, start + 8], [0, 1], clamp);

  return (
    <>
      <KenBurns src={photo} fx={0.5} fy={0.55} zoomFrom={1.05} zoomTo={1.2} brightness={0.4} />
      <AbsoluteFill
        style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7) 100%)'}}
      />

      <Interactive.Div
        name="Encontrala en"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 590,
          textAlign: 'center',
          fontFamily: barlow,
          fontWeight: 700,
          fontSize: 60,
          letterSpacing: 10,
          color: '#ffb300',
          textTransform: 'uppercase',
          opacity: fade(0),
          translate: rise(0),
        }}
      >
        Encontrala en
      </Interactive.Div>
      <Interactive.Div
        name="Local"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 660,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 215,
          lineHeight: 1.05,
          color: '#e10600',
          textTransform: 'uppercase',
          textShadow: '0 0 70px rgba(225,6,0,0.6), 0 8px 0 #000',
          opacity: fade(4),
          scale: interpolate(frame, [4, 16], [1.5, 1], {...clamp, easing: ease, output: 'perceptual-scale'}),
        }}
      >
        Motorock
      </Interactive.Div>
      <Interactive.Div
        name="Local (línea 2)"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 900,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 120,
          lineHeight: 1,
          letterSpacing: 6,
          color: '#f5ecd9',
          textTransform: 'uppercase',
          opacity: fade(10),
          translate: rise(10),
        }}
      >
        Comidas
      </Interactive.Div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1050, display: 'flex', justifyContent: 'center'}}>
        <Interactive.Div
          name="Ciudad"
          style={{
            fontFamily: barlow,
            fontWeight: 700,
            fontSize: 70,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#0b0b0b',
            backgroundColor: '#ffb300',
            padding: '6px 38px',
            rotate: '-3deg',
            opacity: fade(16),
            scale: interpolate(frame, [16, 26], [0, 1], {...clamp, easing: ease, output: 'perceptual-scale'}),
          }}
        >
          Merlo
        </Interactive.Div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1230,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {cues.map((c, i) => {
          const lit = frame >= c;
          return (
            <div
              key={i}
              style={{
                width: 290,
                height: 280,
                borderRadius: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: lit ? '#ffb300' : 'rgba(255,255,255,0.12)',
                color: lit ? '#0b0b0b' : 'rgba(245,236,217,0.6)',
                scale: lit ? interpolate(frame, [c, c + 8], [0.85, 1], {...clamp, easing: ease}) : 0.95,
                opacity: fade(20 + i * 4),
              }}
            >
              <div style={{fontFamily: anton, fontSize: 170, lineHeight: 1}}>{i + 1}</div>
              <div
                style={{
                  fontFamily: barlow,
                  fontWeight: 700,
                  fontSize: 40,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {labels[i]}
              </div>
            </div>
          );
        })}
      </div>
      <Interactive.Div
        name="De carne"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1540,
          textAlign: 'center',
          fontFamily: barlow,
          fontWeight: 700,
          fontSize: 52,
          letterSpacing: 8,
          color: '#f5ecd9',
          textTransform: 'uppercase',
          opacity: fade(32),
        }}
      >
        de carne
      </Interactive.Div>
    </>
  );
};

export const CtaCard = Interactive.create({
  Component: CtaCardInner,
  layout: 'absolute-fill',
});
