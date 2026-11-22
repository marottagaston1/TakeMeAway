import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {anton} from '../fonts';
import {KenBurns} from '../KenBurns';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EndCardInner: React.FC<{readonly photo: string}> = ({photo}) => {
  const frame = useCurrentFrame();
  const amp = interpolate(frame, [4, 24], [20, 0], clamp);
  const shake = `${Math.sin(frame * 5.3) * amp}px ${Math.cos(frame * 4.7) * amp}px`;
  return (
    <>
      <AbsoluteFill style={{translate: shake}}>
        <KenBurns src={photo} fx={0.5} fy={0.5} zoomFrom={1.0} zoomTo={1.25} brightness={0.7} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 60%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 330,
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
            fontSize: 120,
            lineHeight: 1,
            letterSpacing: 4,
            color: '#f5ecd9',
            textTransform: 'uppercase',
            opacity: interpolate(frame, [0, 6], [0, 1], clamp),
            translate: interpolate(frame, [0, 14], ['-700px 0px', '0px 0px'], {
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
            fontFamily: anton,
            fontSize: 250,
            lineHeight: 1,
            color: '#e10600',
            textTransform: 'uppercase',
            textShadow: '0 0 70px rgba(225,6,0,0.65), 0 8px 0 #000',
            opacity: interpolate(frame, [8, 9], [0, 1], clamp),
            scale: interpolate(frame, [9, 19], [2.6, 1], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            }),
          }}
        >
          Rockera
        </Interactive.Div>
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [9, 13, 24], [0, 0.7, 0], clamp),
        }}
      />
    </>
  );
};

export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: 'absolute-fill',
});
