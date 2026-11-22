import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadMarker} from '@remotion/google-fonts/PermanentMarker';
import {loadFont as loadBarlow} from '@remotion/google-fonts/BarlowCondensed';

export const anton = loadAnton('normal', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;

export const marker = loadMarker('normal', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;

export const barlow = loadBarlow('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
}).fontFamily;
