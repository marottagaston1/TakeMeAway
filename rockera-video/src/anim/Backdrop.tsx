import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';

// Fondo rockero: degradé vino, rayos rojos que giran, puntos de semitono y grano de papel.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #4a1210 0%, #1d0b0a 62%, #0a0505 100%)'}} />
      <AbsoluteFill
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 45%, rgba(225,6,0,0.17) 0deg 7deg, transparent 7deg 14deg)',
          rotate: `${frame * 0.12}deg`,
          scale: 1.7,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 0%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 0%, transparent 62%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 2.5px, transparent 3.5px)',
          backgroundSize: '26px 26px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('brand/grain.png')})`,
          backgroundSize: '512px 512px',
          mixBlendMode: 'overlay',
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
