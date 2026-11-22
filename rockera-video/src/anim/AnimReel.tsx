import React from 'react';
import {Audio} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, Img, Sequence, staticFile, Track, useVideoConfig} from 'remotion';
import {Captions} from '../reel/Captions';
import {CtaCard} from '../reel/CtaCard';
import timing from '../reel/timing.json';
import {Hook} from './Hook';
import {Stage, type StageMarks} from './Stage';
import spec from './spec3.json';

// Versión 3: 100% animada, sin fotos de comida. Mismas palabras y tiempos que la versión 2.
const captions: Caption[] = timing.words.map((w) => ({
  text: w.text,
  startMs: w.startMs,
  endMs: w.endMs,
  timestampMs: null,
  confidence: null,
}));

// Frame de una palabra del guion (en orden: la busca después de la anterior).
const makeFinder = (fps: number) => {
  let from = 0;
  return (token: string): number => {
    const i = captions.findIndex((c, k) => k >= from && c.text === token);
    if (i < 0) throw new Error(`No encuentro la palabra "${token}" en la narración`);
    from = i + 1;
    return Math.round((captions[i].startMs / 1000) * fps);
  };
};

const frameOf = (token: string, fps: number): number => {
  const i = captions.findIndex((c) => c.text === token);
  if (i < 0) throw new Error(`No encuentro la palabra "${token}" en la narración`);
  return Math.round((captions[i].startMs / 1000) * fps);
};

export const AnimReel: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const next = makeFinder(fps);
  const una = next('Una,');
  const dos = next('dos');
  const tres = next('tres');
  const pero = next('Pero');
  const mira = next('mirá');
  const medallon = next('Medallón');
  const cheddar = next('Cheddar.');
  const panceta = next('Panceta.');
  const cebolla = next('Cebolla');
  const huevo = next('Huevo');
  const salsa = next('Salsa');
  const pan = next('Y');
  const siete = next('Siete');
  const bocado = next('bocado.');
  const hamburguesa = next('Hamburguesa');
  const encontrala = next('Encontrala');
  const pedila = next('Pedila');

  const s0 = Math.max(0, pero - 2); // la hamburguesa empieza a caer un poco antes de "Pero"
  const marks: StageMarks = {
    explode: mira - s0,
    items: [medallon, cheddar, panceta, cebolla, huevo, salsa, pan].map((m) => m - s0),
    siete: siete - s0 - 2,
    bocado: bocado - s0,
    hamburguesa: hamburguesa - s0 - 2,
  };

  const sfxItems = spec.sfx.map((it) => ({
    ...it,
    from: Math.max(0, frameOf(it.token, fps) + it.offset),
    frames: Math.round(it.seconds * fps),
  }));

  return (
    <>
      <AbsoluteFill style={{backgroundColor: '#0b0b0b'}} />
      <Audio name="Narración" src={staticFile(spec.voice)} />

      <Sequence name="Gancho: 1, 2 o 3" from={0} durationInFrames={s0}>
        <Hook cues={[una, dos, tres]} />
      </Sequence>
      <Sequence name="Hamburguesa que se desarma" from={s0} durationInFrames={encontrala - s0}>
        <Stage marks={marks} />
      </Sequence>
      <Sequence name="Cierre: logo y WhatsApp" from={encontrala} durationInFrames={durationInFrames - encontrala}>
        <CtaCard photo="" cues={[pedila - encontrala]} whatsapp={spec.whatsapp} />
      </Sequence>

      {sfxItems.map((it, k) => (
        <Track key={k} name={`Efecto: ${it.group}`}>
          <Audio
            name={it.group}
            src={staticFile(it.file)}
            from={it.from}
            durationInFrames={it.frames}
            volume={it.volume}
            playbackRate={it.rate ?? 1}
          />
        </Track>
      ))}

      <Sequence name="Marca de agua" from={0} durationInFrames={Math.max(1, encontrala)} layout="none">
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
