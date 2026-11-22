import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {anton, barlow, marker} from './fonts';
import {KenBurns} from './KenBurns';

type Props = {
  readonly photo: string;
  readonly fx: number;
  readonly fy: number;
  readonly zoom: number;
  readonly number: string;
  readonly line1: string;
  readonly line2: string;
  readonly tagline: string;
  readonly size: number;
};

const IngredientInner: React.FC<Props> = ({
  photo,
  fx,
  fy,
  zoom,
  number,
  line1,
  line2,
  tagline,
  size,
}) => {
  const frame = useCurrentFrame();

  // Temblor al entrar cada escena (golpe de batería).
  const amp = interpolate(frame, [0, 12], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shake = `${Math.sin(frame * 4.1) * amp}px ${Math.cos(frame * 3.3) * amp}px`;

  return (
    <>
      <AbsoluteFill style={{translate: shake}}>
        <KenBurns src={photo} fx={fx} fy={fy} zoomFrom={1.2} zoomTo={zoom} ty={0.36} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.7) 26%, rgba(0,0,0,0) 56%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 18%)',
        }}
      />

      <Interactive.Div
        name="Número"
        style={{
          position: 'absolute',
          left: 80,
          top: 150,
          fontFamily: marker,
          fontSize: 92,
          color: '#ffb300',
          rotate: '-4deg',
          opacity: interpolate(frame, [4, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {number}
      </Interactive.Div>

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div style={{overflow: 'hidden', paddingTop: 6}}>
          <Interactive.Div
            name="Ingrediente"
            style={{
              fontFamily: anton,
              fontSize: size,
              lineHeight: 1.02,
              color: '#f5ecd9',
              textTransform: 'uppercase',
              translate: interpolate(frame, [6, 18], ['0px 190px', '0px 0px'], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {line1}
          </Interactive.Div>
        </div>
        {line2 ? (
          <div style={{overflow: 'hidden'}}>
            <Interactive.Div
              name="Ingrediente (línea 2)"
              style={{
                fontFamily: anton,
                fontSize: size,
                lineHeight: 1.02,
                color: '#e10600',
                textTransform: 'uppercase',
                translate: interpolate(frame, [10, 22], ['0px 190px', '0px 0px'], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            >
              {line2}
            </Interactive.Div>
          </div>
        ) : null}

        {tagline ? (
        <Interactive.Div
          name="Descripción"
          style={{
            marginTop: 26,
            fontFamily: barlow,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#0b0b0b',
            backgroundColor: '#ffb300',
            padding: '8px 26px',
            rotate: '-2deg',
            scale: interpolate(frame, [18, 28], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            }),
            transformOrigin: 'left center',
          }}
        >
          {tagline}
        </Interactive.Div>
        ) : null}
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [0, 6], [0.55, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </>
  );
};

export const Ingredient = Interactive.create({
  Component: IngredientInner,
  layout: 'absolute-fill',
  schema: {
    number: {type: 'string', default: '01 / 07', description: 'Número'},
    line1: {type: 'string', default: '', description: 'Ingrediente (línea 1)'},
    line2: {type: 'string', default: '', description: 'Ingrediente (línea 2)'},
    tagline: {type: 'string', default: '', description: 'Descripción'},
  },
});
