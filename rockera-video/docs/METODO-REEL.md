# Cómo se arma un reel (método)

Un video = un guion + una voz + fotos + un archivo `spec.json`. No se escribe código nuevo por video.

```
guion.txt ──► voz (ElevenLabs) ──► tiempos por palabra ──► spec.json ──► Remotion ──► MP4
```

## Pasos
1. **Guion** (`src/reel/guion.txt`): ~2,4 palabras por segundo. Un gancho en la primera frase.
2. **Voz**: ElevenLabs (voz rioplatense). Guardar el MP3 en `public/voice/`.
3. **Tiempos por palabra** → `src/reel/timing.json` (`{words:[{text,startMs,endMs}]}`):
   - Ideal: transcripción de ElevenLabs (Scribe), que da inicio y fin exactos de cada palabra.
   - Alternativa sin red: `python3 tools/align_local.py public/voice/take1.mp3 src/reel/guion.txt src/reel/timing.json`
     (aproximada, usa las pausas del audio; error de unas décimas de segundo).
4. **Escenas** en `src/reel/spec.json`: cada una tiene un `anchor` (la palabra exacta del guion donde empieza,
   con su puntuación, buscada en orden), un `kind` (`photo`, `ingredient`, `end`) y su foto.
   La duración de cada escena sale del audio: no se desfasa.
5. **Composición**: `PlatoEspecial` en `src/Root.tsx`. La duración (en frames) = narración + cola, a mano.
6. **Vista previa**: `npm run dev`. **Render**: `npx remotion render PlatoEspecial out/video.mp4`.

## Ojo
- Los subtítulos queman el texto del guion; el audio solo aporta el tiempo.
- Fotos verticales 9:16; las reales de comida venden más que cualquier ilustración.
- En el entorno de nube, Remotion necesita `--browser-executable=/opt/pw-browsers/chromium` y WebGL por
  software (`--gl=swangle`) para el 3D.
