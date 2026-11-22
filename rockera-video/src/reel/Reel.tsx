import React from 'react';
import {Audio} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Ingredient} from '../Ingredient';
import {KenBurns} from '../KenBurns';
import {Captions} from './Captions';
import {EndCard} from './EndCard';
import spec from './spec.json';
import timing from './timing.json';

type Scene = (typeof spec.scenes)[number];

// Cada escena arranca en la palabra "ancla" de la narración (con un adelanto de 3 frames),
// así los cortes caen sobre la voz y nada se desfasa.
const LEAD_FRAMES = 3;

const captions: Caption[] = timing.words.map((w) => ({
  text: w.text,
  startMs: w.startMs,
  endMs: w.endMs,
  timestampMs: null,
  confidence: null,
}));

const anchorFrames = (fps: number): number[] => {
  const out: number[] = [];
  let from = 0;
  for (const s of spec.scenes) {
    const idx = captions.findIndex((c, i) => i >= from && c.text === s.anchor);
    if (idx < 0) throw new Error(`No encuentro la palabra ancla "${s.anchor}" en la narración`);
    out.push(Math.max(0, Math.round((captions[idx].startMs / 1000) * fps) - LEAD_FRAMES));
    from = idx + 1;
  }
  out[0] = 0;
  return out;
};

const renderScene = (s: Scene) => {
  if (s.kind === 'ingredient') {
    return (
      <Ingredient
        photo={s.photo}
        fx={s.fx ?? 0.5}
        fy={s.fy ?? 0.5}
        zoom={s.zoom ?? 1.8}
        number={s.number ?? ''}
        line1={s.line1 ?? ''}
        line2={s.line2 ?? ''}
        tagline=""
        size={s.size ?? 160}
      />
    );
  }
  if (s.kind === 'end') return <EndCard photo={s.photo} />;
  return (
    <KenBurns
      src={s.photo}
      fx={s.fx ?? 0.5}
      fy={s.fy ?? 0.5}
      zoomFrom={s.zoomFrom ?? 1.05}
      zoomTo={s.zoomTo ?? 1.3}
      brightness={s.brightness ?? 1}
    />
  );
};

export const Reel: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const starts = anchorFrames(fps);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: '#0b0b0b'}} />
      <Audio name="Narración" src={staticFile(spec.voice)} />
      {spec.scenes.map((s, i) => {
        const end = i + 1 < starts.length ? starts[i + 1] : durationInFrames;
        return (
          <Sequence key={s.name} name={s.name} from={starts[i]} durationInFrames={end - starts[i]}>
            {renderScene(s)}
          </Sequence>
        );
      })}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 34%)',
        }}
      />
      <Captions captions={captions} top={290} />
    </>
  );
};
