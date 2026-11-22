import React, {useMemo} from 'react';
import type {Caption} from '@remotion/captions';
import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {barlow} from '../fonts';

// Agrupa las palabras en "páginas" de pocas palabras, cortando en puntuación fuerte.
const paginate = (caps: readonly Caption[]): Caption[][] => {
  const pages: Caption[][] = [];
  let cur: Caption[] = [];
  let chars = 0;
  for (const c of caps) {
    cur.push(c);
    chars += c.text.length + 1;
    if (/[.?!:]$/.test(c.text) || cur.length >= 5 || chars > 26) {
      pages.push(cur);
      cur = [];
      chars = 0;
    }
  }
  if (cur.length) pages.push(cur);
  return pages;
};

// Subtítulos palabra por palabra: la palabra que suena va resaltada en una caja roja,
// las que faltan quedan atenuadas. El texto sale del guion; el audio solo da el tiempo.
export const Captions: React.FC<{readonly captions: readonly Caption[]; readonly top: number}> = ({
  captions,
  top,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame / fps) * 1000;
  const pages = useMemo(() => paginate(captions), [captions]);

  const i = pages.findIndex((p, k) => {
    const start = p[0].startMs - 80;
    const next = pages[k + 1];
    const end = next ? next[0].startMs - 80 : p[p.length - 1].endMs + 500;
    return t >= start && t < end;
  });
  if (i < 0) return null;
  const page = pages[i];
  const pageStartFrame = ((page[0].startMs - 80) / 1000) * fps;

  return (
    <Interactive.Div
      name="Subtítulos"
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top,
        textAlign: 'center',
        opacity: interpolate(frame, [pageStartFrame, pageStartFrame + 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        translate: interpolate(frame, [pageStartFrame, pageStartFrame + 6], ['0px 24px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {page.map((w, k) => {
        const next = page[k + 1];
        const active = t >= w.startMs && t < (next ? next.startMs : w.endMs + 120);
        const done = t >= w.endMs && !active;
        return (
          <span
            key={`${i}-${k}`}
            style={{
              display: 'inline-block',
              margin: '6px 8px',
              padding: '0 16px',
              borderRadius: 16,
              fontFamily: barlow,
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.18,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'white',
              backgroundColor: active ? '#e10600' : 'transparent',
              opacity: active || done ? 1 : 0.5,
              scale: active ? 1.07 : 1,
              textShadow: active ? 'none' : '0 4px 14px rgba(0,0,0,0.85)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </Interactive.Div>
  );
};
