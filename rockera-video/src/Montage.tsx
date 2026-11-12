import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {anton, marker} from './fonts';

const Shot: React.FC<{readonly src: string; readonly tilt: number}> = ({src, tilt}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Img
        name="Foto real"
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          rotate: `${tilt}deg`,
          scale: interpolate(frame, [0, 20], [1.08, 1.2], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [0, 4], [0.7, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </>
  );
};

const MontageInner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Sequence name="Foto real 1" from={0} durationInFrames={20}>
        <Shot src="fotos/foto07.jpg" tilt={0} />
      </Sequence>
      <Sequence name="Foto real 2" from={20} durationInFrames={20}>
        <Shot src="fotos/foto08.jpg" tilt={-2} />
      </Sequence>
      <Sequence name="Foto real 3" from={40} durationInFrames={20}>
        <Shot src="fotos/foto09.jpg" tilt={2} />
      </Sequence>
      <Sequence name="Foto real 4" from={60} durationInFrames={20}>
        <Shot src="fotos/foto10.jpg" tilt={-2} />
      </Sequence>
      <Sequence name="Foto real 5" from={80} durationInFrames={20}>
        <Shot src="fotos/foto11.jpg" tilt={0} />
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 38%), linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 16%)',
        }}
      />

      <Interactive.Div
        name="Antetítulo"
        style={{
          position: 'absolute',
          left: 80,
          bottom: 400,
          fontFamily: marker,
          fontSize: 88,
          color: '#ffb300',
          rotate: '-5deg',
          opacity: interpolate(frame, [4, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        así sale
      </Interactive.Div>
      <div style={{position: 'absolute', left: 80, bottom: 190, overflow: 'hidden', paddingTop: 6}}>
        <Interactive.Div
          name="Título"
          style={{
            fontFamily: anton,
            fontSize: 220,
            lineHeight: 1.05,
            color: '#f5ecd9',
            textTransform: 'uppercase',
            textShadow: '0 6px 0 #e10600',
            translate: interpolate(frame, [2, 14], ['0px 260px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Sin filtro
        </Interactive.Div>
      </div>
    </>
  );
};

export const Montage = Interactive.create({
  Component: MontageInner,
  layout: 'absolute-fill',
});
