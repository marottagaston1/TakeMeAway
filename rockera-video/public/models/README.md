# Modelos 3D reales (.glb)

Una capa por archivo. Nombres de capa (`LayerKey`):
`top` (pan superior), `egg`, `bacon`, `onion`, `cheese`, `patty`, `sauce`, `bottom` (pan inferior).

1. Copia el `.glb` aquí, por ejemplo `public/models/patty.glb`.
2. Regístralo en `src/desarme/models.ts`:

   export const MODELS = {patty: 'models/patty.glb', cheese: 'models/cheddar.glb'};

3. Las capas sin archivo usan el modelo procedural de respaldo.

Cada modelo se centra, se apoya en y=0 y se escala al tamaño de `NOMINAL` en `models.ts`
(ancho = diámetro, alto = grosor), así que no importa en qué escala o posición venga.

Recomendaciones:
- Un ingrediente por archivo, acostado como en la hamburguesa, con "arriba" hacia +Y.
- Menos de ~10 MB por archivo. Se aceptan texturas embebidas y compresión Meshopt (no Draco).
- Si un archivo no carga, esa capa vuelve al modelo procedural y se avisa en la consola.
