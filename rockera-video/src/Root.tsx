import React from 'react';
import {Composition} from 'remotion';
import {RockeraVideo} from './RockeraVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HamburguesaRockera"
      component={RockeraVideo}
      durationInFrames={757}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
