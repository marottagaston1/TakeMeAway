import type {LayerKey} from './rig';

// Modelos 3D reales (.glb) para reemplazar las capas procedurales.
// Copia cada archivo en public/models/ y escribe aquí su nombre.
// Las capas que queden vacías usan el modelo procedural de respaldo.
//
//   const MODELS = {patty: 'models/patty.glb', cheese: 'models/cheddar.glb'}
export const MODELS: Partial<Record<LayerKey, string>> = {};

// Tamaño "de diseño" de cada capa en el 3D (en unidades de la escena).
// width = diámetro (o lado mayor), height = grosor.
// Cada .glb se centra, se apoya en y=0 y se escala a este tamaño.
export const NOMINAL: Record<LayerKey, {width: number; height: number}> = {
  bottom: {width: 3.44, height: 0.55},
  sauce: {width: 3.0, height: 0.08},
  patty: {width: 3.0, height: 0.4},
  cheese: {width: 3.1, height: 0.16},
  onion: {width: 2.4, height: 0.3},
  bacon: {width: 3.2, height: 0.16},
  egg: {width: 3.3, height: 0.22},
  top: {width: 3.44, height: 1.07},
};
