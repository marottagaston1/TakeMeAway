import React from 'react';
import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {staticFile, Track} from 'remotion';
import {Ingredient} from './Ingredient';
import {Intro} from './Intro';
import {Montage} from './Montage';
import {Outro} from './Outro';

// Cada escena de ingrediente dura 72 frames y cada transición solapa 8,
// así que cada corte cae 64 frames después del anterior:
// intro 0 → ingrediente 1 en 97 → ... → ingrediente 7 en 481 → fotos reales en 545 → cierre en 637.
export const RockeraVideo: React.FC = () => {
  return (
    <>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={105}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-bottom'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Medallón de carne" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto05.jpg"
            fx={0.5}
            fy={0.64}
            zoom={1.9}
            number="01 / 07"
            line1="Medallón"
            line2="de carne"
            tagline="Smash a la plancha"
            size={190}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Cheddar" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto01.jpg"
            fx={0.55}
            fy={0.56}
            zoom={1.9}
            number="02 / 07"
            line1="Cheddar"
            line2=""
            tagline="Bien fundido"
            size={230}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Panceta" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto06.jpg"
            fx={0.27}
            fy={0.72}
            zoom={2.1}
            number="03 / 07"
            line1="Panceta"
            line2=""
            tagline="Crocante"
            size={230}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Cebolla caramelizada" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto04.jpg"
            fx={0.66}
            fy={0.69}
            zoom={2.3}
            number="04 / 07"
            line1="Cebolla"
            line2="caramelizada"
            tagline="Lenta y dulce"
            size={150}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Huevo frito" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto05.jpg"
            fx={0.6}
            fy={0.44}
            zoom={1.8}
            number="05 / 07"
            line1="Huevo"
            line2="frito"
            tagline="Con borde crujiente"
            size={200}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Salsa especial" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto02.jpg"
            fx={0.3}
            fy={0.27}
            zoom={2.2}
            number="06 / 07"
            line1="Salsa"
            line2="especial"
            tagline="La de la casa"
            size={200}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Pan de papa" durationInFrames={72}>
          <Ingredient
            photo="fotos/foto01.jpg"
            fx={0.55}
            fy={0.34}
            zoom={1.7}
            number="07 / 07"
            line1="Pan de papa"
            line2="con parmesano"
            tagline="Chispas de queso parmesano"
            size={125}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Fotos reales" durationInFrames={100}>
          <Montage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: 8})}
        />

        <TransitionSeries.Sequence name="Cierre" durationInFrames={120}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Track name="Whoosh en cortes">
        <Audio name="Whoosh 1" src={staticFile("sfx/whoosh.wav")} from={93} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 2" src={staticFile("sfx/whoosh.wav")} from={157} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 3" src={staticFile("sfx/whoosh.wav")} from={221} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 4" src={staticFile("sfx/whoosh.wav")} from={285} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 5" src={staticFile("sfx/whoosh.wav")} from={349} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 6" src={staticFile("sfx/whoosh.wav")} from={413} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 7" src={staticFile("sfx/whoosh.wav")} from={477} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 8" src={staticFile("sfx/whoosh.wav")} from={541} durationInFrames={30} volume={0.5} />
        <Audio name="Whoosh 9" src={staticFile("sfx/whoosh.wav")} from={633} durationInFrames={30} volume={0.5} />
      </Track>
      <Track name="Obturador fotos reales">
        <Audio name="Disparo 1" src={staticFile("sfx/shutter.wav")} from={545} durationInFrames={18} volume={0.45} />
        <Audio name="Disparo 2" src={staticFile("sfx/shutter.wav")} from={565} durationInFrames={18} volume={0.45} />
        <Audio name="Disparo 3" src={staticFile("sfx/shutter.wav")} from={585} durationInFrames={18} volume={0.45} />
        <Audio name="Disparo 4" src={staticFile("sfx/shutter.wav")} from={605} durationInFrames={18} volume={0.45} />
        <Audio name="Disparo 5" src={staticFile("sfx/shutter.wav")} from={625} durationInFrames={18} volume={0.45} />
      </Track>
    </>
  );
};
