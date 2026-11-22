import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Movimiento de cámara sobre una foto: hace zoom hacia un punto de interés
// (fx, fy en fracciones 0-1 de la imagen) y lo va llevando hacia (tx, ty).
// El cálculo es programático (por frame), no es editable desde Studio.
export const KenBurns: React.FC<{
  readonly src: string;
  readonly fx: number;
  readonly fy: number;
  readonly zoomFrom: number;
  readonly zoomTo: number;
  readonly tx?: number;
  readonly ty?: number;
  readonly brightness?: number;
}> = ({src, fx, fy, zoomFrom, zoomTo, tx = 0.5, ty = 0.4, brightness = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();

  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const s = zoomFrom + (zoomTo - zoomFrom) * p;
  const ox = fx * width;
  const oy = fy * height;

  // Desplazamiento que lleva el punto de interés hacia el objetivo,
  // limitado para que la foto siempre cubra todo el cuadro.
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const tX = clamp((tx * width - ox) * p, -(s - 1) * (width - ox), (s - 1) * ox);
  const tY = clamp((ty * height - oy) * p, -(s - 1) * (height - oy), (s - 1) * oy);

  return (
    <Img
      name="Foto"
      src={staticFile(src)}
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        objectFit: 'cover',
        transformOrigin: `${ox}px ${oy}px`,
        translate: `${tX}px ${tY}px`,
        scale: s,
        filter: brightness === 1 ? undefined : `brightness(${brightness})`,
      }}
    />
  );
};
