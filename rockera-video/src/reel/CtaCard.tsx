import React from 'react';
import {AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {anton, barlow} from '../fonts';
import {KenBurns} from '../KenBurns';
import {BurgerStack} from './BurgerStack';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Los tres números se encienden en el frame de cada cue (cuando la voz dice "uno", "dos" y "tres").
const CtaCardInner: React.FC<{readonly photo: string; readonly cues: readonly number[]}> = ({photo, cues}) => {
  const frame = useCurrentFrame();
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
          top: 520,
          textAlign: 'center',
          fontFamily: barlow,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: 10,
          color: '#ffb300',
          textTransform: 'uppercase',
          opacity: fade(0),
          translate: rise(0),
        }}
      >
        Encontrala en
      </Interactive.Div>
      <Img
        name="Logo Motorock"
        src={staticFile('brand/motorock-logo.png')}
        style={{
          position: 'absolute',
          left: 280,
          top: 600,
          width: 520,
          opacity: fade(4),
          scale: interpolate(frame, [4, 16], [1.4, 1], {...clamp, easing: ease, output: 'perceptual-scale'}),
        }}
      />
      <Interactive.Div
        name="Local (línea 2)"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1020,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 100,
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
      <div style={{position: 'absolute', left: 0, right: 0, top: 1135, display: 'flex', justifyContent: 'center'}}>
        <Interactive.Div
          name="Ciudad"
          style={{
            fontFamily: barlow,
            fontWeight: 700,
            fontSize: 62,
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
          top: 1275,
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
                opacity: fade(20 + i * 4),
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
                {i + 1} {i === 0 ? 'Medallón' : 'Medallones'}
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
          top: 1570,
          textAlign: 'center',
          fontFamily: barlow,
          fontWeight: 700,
          fontSize: 50,
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
