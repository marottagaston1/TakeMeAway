import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow, marker} from './fonts';
import {KenBurns} from './KenBurns';

const fadeUp = (frame: number, start: number) =>
  interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const OutroInner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <KenBurns src="fotos/foto03.jpg" fx={0.5} fy={0.5} zoomFrom={1.05} zoomTo={1.2} brightness={0.38} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <Interactive.Div
        name="Título 1"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 130,
          lineHeight: 1,
          letterSpacing: 4,
          color: '#f5ecd9',
          textTransform: 'uppercase',
          opacity: fadeUp(frame, 0),
          translate: interpolate(frame, [0, 14], ['0px 60px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
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
          top: 310,
          textAlign: 'center',
          fontFamily: anton,
          fontSize: 250,
          lineHeight: 1,
          color: '#e10600',
          textTransform: 'uppercase',
          textShadow: '0 0 60px rgba(225,6,0,0.6), 0 6px 0 #000',
          opacity: fadeUp(frame, 6),
          translate: interpolate(frame, [6, 20], ['0px 60px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Rockera
      </Interactive.Div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {[
          'Medallón de carne',
          'Cheddar',
          'Panceta',
          'Cebolla caramelizada',
          'Huevo frito',
          'Salsa especial',
          'Pan de papa con chispas de parmesano',
        ].map((item, i) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: fadeUp(frame, 22 + i * 5),
              translate: interpolate(frame, [22 + i * 5, 32 + i * 5], ['-60px 0px', '0px 0px'], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <div style={{width: 44, height: 8, backgroundColor: '#e10600', rotate: '-20deg'}} />
            <div
              style={{
                fontFamily: barlow,
                fontWeight: 700,
                fontSize: 58,
                letterSpacing: 2,
                color: '#f5ecd9',
                textTransform: 'uppercase',
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>

      <Interactive.Div
        name="Cierre"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 300,
          textAlign: 'center',
          fontFamily: marker,
          fontSize: 150,
          color: '#ffb300',
          rotate: '-5deg',
          opacity: interpolate(frame, [70, 72], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [70, 82], [2.2, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
        }}
      >
        ¡Probala!
      </Interactive.Div>

      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [70, 74, 86], [0, 0.6, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </>
  );
};

export const Outro = Interactive.create({
  Component: OutroInner,
  layout: 'absolute-fill',
});
