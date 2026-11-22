import React from 'react';
import {Composition} from 'remotion';
import {Desarme} from './desarme/Desarme';
import {RockeraVideo} from './RockeraVideo';
import {Reel} from './reel/Reel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HamburguesaRockera"
        component={RockeraVideo}
        durationInFrames={757}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HamburguesaDesarme"
        component={Desarme}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 26,67 s de narración + 3 s de cierre = 891 frames */}
      <Composition
        id="PlatoEspecial"
        component={Reel}
        durationInFrames={891}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
