import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton, barlow, marker} from './fonts';
import {KenBurns} from './KenBurns';

const IntroInner: React.FC = () => {
  const frame = useCurrentFrame();

  // Golpe cuando "ROCKERA" cae en el cuadro (frame ~24).
  const amp = interpolate(frame, [22, 40], [26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shake = `${Math.sin(frame * 5.3) * amp}px ${Math.cos(frame * 4.7) * amp}px`;

  return (
    <>
      <AbsoluteFill style={{translate: shake}}>
        <KenBurns src="fotos/foto01.jpg" fx={0.55} fy={0.55} zoomFrom={1.05} zoomTo={1.3} brightness={0.6} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 640,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          translate: shake,
        }}
      >
        <Interactive.Div
          name="Título 1"
          style={{
            fontFamily: anton,
            fontSize: 150,
            lineHeight: 1,
            color: '#f5ecd9',
            letterSpacing: 4,
            textTransform: 'uppercase',
            translate: interpolate(frame, [4, 18], ['-900px 0px', '0px 0px'], {
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
            fontFamily: anton,
            fontSize: 285,
            lineHeight: 1,
            color: '#e10600',
            textTransform: 'uppercase',
            textShadow: '0 0 70px rgba(225,6,0,0.65), 0 8px 0 #000',
            opacity: interpolate(frame, [15, 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: interpolate(frame, [16, 26], [2.8, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            }),
          }}
        >
          Rockera
        </Interactive.Div>
        <Interactive.Div
          name="Subtítulo"
          style={{
            marginTop: 20,
            fontFamily: marker,
            fontSize: 104,
            color: '#ffb300',
            rotate: '-5deg',
            opacity: interpolate(frame, [44, 52], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            translate: interpolate(frame, [44, 56], ['0px 40px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          capa por capa
        </Interactive.Div>
      </div>

      <Interactive.Div
        name="Aviso"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          textAlign: 'center',
          fontFamily: barlow,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 6,
          color: '#f5ecd9',
          textTransform: 'uppercase',
          opacity: interpolate(frame, [30, 42], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Pan de papa · Cheddar · Panceta
      </Interactive.Div>

      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [16, 22, 34], [0, 0.85, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </>
  );
};

export const Intro = Interactive.create({
  Component: IntroInner,
  layout: 'absolute-fill',
});
