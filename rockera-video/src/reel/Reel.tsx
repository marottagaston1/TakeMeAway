import React from 'react';
import {Audio} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Img, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Ingredient} from '../Ingredient';
import {KenBurns} from '../KenBurns';
import {Captions} from './Captions';
import {CtaCard} from './CtaCard';
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

const frameOf = (idx: number, fps: number) => Math.round((captions[idx].startMs / 1000) * fps);

// Devuelve, por escena, el frame de inicio y el frame (relativo a la escena) de cada cue.
const buildPlan = (fps: number): {start: number; cues: number[]}[] => {
  const plan: {start: number; cues: number[]}[] = [];
  let from = 0;
  for (const s of spec.scenes) {
    const idx = captions.findIndex((c, i) => i >= from && c.text === s.anchor);
    if (idx < 0) throw new Error(`No encuentro la palabra ancla "${s.anchor}" en la narración`);
    const start = Math.max(0, frameOf(idx, fps) - LEAD_FRAMES);
    const cues: number[] = [];
    let cf = idx;
    for (const token of s.cues ?? []) {
      const ci = captions.findIndex((c, i) => i >= cf && c.text === token);
      if (ci < 0) throw new Error(`No encuentro la palabra "${token}" para el cue de "${s.name}"`);
      cues.push(Math.max(0, frameOf(ci, fps) - start - 2));
      cf = ci + 1;
    }
    plan.push({start, cues});
    from = idx + 1;
  }
  plan[0].start = 0;
  return plan;
};

const renderScene = (s: Scene, cues: number[]) => {
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
  if (s.kind === 'cta') return <CtaCard photo={s.photo} cues={cues} />;
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
  const plan = buildPlan(fps);
  const ctaIdx = spec.scenes.findIndex((sc) => sc.kind === 'cta');
  const ctaStart = ctaIdx >= 0 ? plan[ctaIdx].start : durationInFrames;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: '#0b0b0b'}} />
      <Audio name="Narración" src={staticFile(spec.voice)} />
      {spec.scenes.map((s, i) => {
        const start = plan[i].start;
        const end = i + 1 < plan.length ? plan[i + 1].start : durationInFrames;
        return (
          <Sequence key={s.name} name={s.name} from={start} durationInFrames={end - start}>
            {renderScene(s, plan[i].cues)}
          </Sequence>
        );
      })}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 34%)',
        }}
      />
      <Sequence name="Marca de agua" from={0} durationInFrames={Math.max(1, ctaStart)} layout="none">
        <Img
          name="Logo Motorock (marca de agua)"
          src={staticFile('brand/motorock-logo.png')}
          style={{position: 'absolute', right: 60, top: 105, width: 150, opacity: 0.92}}
        />
      </Sequence>
      <Captions captions={captions} top={290} />
    </>
  );
};
