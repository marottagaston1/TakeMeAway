import React from 'react';
import {Composition} from 'remotion';
import {AnimReel} from './anim/AnimReel';
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
      {/* 22,67 s de narración + 2 s de cola = 741 frames */}
      <Composition
        id="PlatoEspecial"
        component={Reel}
        durationInFrames={741}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Versión 3, 100% animada: misma narración (22,67 s + 2 s de cola = 741 frames) */}
      <Composition
        id="AnimadoRockera"
        component={AnimReel}
        durationInFrames={741}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
