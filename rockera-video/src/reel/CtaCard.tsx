import React from 'react';
import {AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {anton, barlow} from '../fonts';
import {KenBurns} from '../KenBurns';
import {Backdrop} from '../anim/Backdrop';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Los tres números se encienden en el frame de cada cue (cuando la voz dice "uno", "dos" y "tres").
const CtaCardInner: React.FC<{
  readonly photo: string;
  readonly cues: readonly number[];
  readonly whatsapp: string;
}> = ({photo, cues, whatsapp}) => {
  const frame = useCurrentFrame();
  const rise = (start: number) => interpolate(frame, [start, start + 14], ['0px 60px', '0px 0px'], {...clamp, easing: ease});
  const fade = (start: number) => interpolate(frame, [start, start + 8], [0, 1], clamp);

  return (
    <>
      {photo ? <KenBurns src={photo} fx={0.5} fy={0.55} zoomFrom={1.05} zoomTo={1.2} brightness={0.4} /> : <Backdrop />}
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

      <div style={{position: 'absolute', left: 0, right: 0, top: 1320, display: 'flex', justifyContent: 'center'}}>
        <Interactive.Div
          name="Pedila por WhatsApp"
          style={{
            fontFamily: barlow,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#0b0b0b',
            backgroundColor: '#25D366',
            padding: '10px 44px',
            borderRadius: 60,
            opacity: interpolate(frame, [cues[0] ?? 40, (cues[0] ?? 40) + 6], [0, 1], clamp),
            scale: interpolate(frame, [cues[0] ?? 40, (cues[0] ?? 40) + 10], [0.6, 1], {...clamp, easing: ease}),
          }}
        >
          Pedila por WhatsApp
        </Interactive.Div>
      </div>
      <Interactive.Div
        name="Número de WhatsApp"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1440,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 130,
          letterSpacing: 4,
          color: '#f5ecd9',
          textShadow: '0 6px 0 #000',
          opacity: interpolate(frame, [(cues[0] ?? 40) + 4, (cues[0] ?? 40) + 12], [0, 1], clamp),
          translate: interpolate(frame, [(cues[0] ?? 40) + 4, (cues[0] ?? 40) + 16], ['0px 40px', '0px 0px'], {...clamp, easing: ease}),
        }}
      >
        {whatsapp}
      </Interactive.Div>
    </>
  );
};

export const CtaCard = Interactive.create({
  Component: CtaCardInner,
  layout: 'absolute-fill',
});
