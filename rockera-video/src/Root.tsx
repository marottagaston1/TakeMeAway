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
      {/* 27,95 s de narración + 2 s de cola = 899 frames */}
      <Composition
        id="PlatoEspecial"
        component={Reel}
        durationInFrames={899}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
