import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {KenBurns} from '../KenBurns';
import {Tiles} from './Tiles';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Gancho: foto con zoom rápido + los tres cuadros 1/2/3 medallones sincronizados con la voz.
const HookCardInner: React.FC<{readonly photo: string; readonly cues: readonly number[]}> = ({photo, cues}) => {
  const frame = useCurrentFrame();
  const amp = interpolate(frame, [0, 10], [14, 0], clamp);
  const shake = `${Math.sin(frame * 4.4) * amp}px ${Math.cos(frame * 3.7) * amp}px`;
  return (
    <>
      <AbsoluteFill style={{translate: shake}}>
        <KenBurns src={photo} fx={0.55} fy={0.55} zoomFrom={1.15} zoomTo={1.45} brightness={0.85} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0) 65%)',
        }}
      />
      <Tiles cues={cues} top={1180} />
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [0, 5], [0.6, 0], {...clamp, easing: Easing.out(Easing.quad)}),
        }}
      />
    </>
  );
};

export const HookCard = Interactive.create({
  Component: HookCardInner,
  layout: 'absolute-fill',
});
