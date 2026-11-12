import {useEffect, useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {continueRender, delayRender, staticFile} from 'remotion';
import {MODELS, NOMINAL} from './models';
import type {LayerKey} from './rig';

// Carga un .glb, lo centra, lo apoya en y=0 y lo escala al tamaño de la capa.
const loadNormalized = (file: string, width: number, height: number): Promise<THREE.Group> =>
  new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      staticFile(file),
      (gltf) => {
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.set(-center.x, -box.min.y, -center.z);
        root.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        const holder = new THREE.Group();
        holder.add(root);
        const s = width / Math.max(size.x, size.z, 1e-6);
        holder.scale.set(s, height / Math.max(size.y, 1e-6), s);
        resolve(holder);
      },
      undefined,
      reject,
    );
  });

export type LoadedModels = Partial<Record<LayerKey, THREE.Group>>;

// Carga todos los modelos de MODELS antes de renderizar.
// Los que fallan se omiten y esa capa usa el modelo procedural de respaldo.
export const useModels = (): LoadedModels => {
  const entries = Object.entries(MODELS) as [LayerKey, string][];
  const [handle] = useState(() => (entries.length > 0 ? delayRender('Cargando modelos 3D') : null));
  const [models, setModels] = useState<LoadedModels | null>(entries.length > 0 ? null : {});

  useEffect(() => {
    if (entries.length === 0) return;
    Promise.all(
      entries.map(async ([key, file]) => {
        try {
          return [key, await loadNormalized(file, NOMINAL[key].width, NOMINAL[key].height)] as const;
        } catch (err) {
          console.warn(`No se pudo cargar ${file}; uso el modelo procedural`, err);
          return null;
        }
      }),
    ).then((res) => {
      const out: LoadedModels = {};
      for (const r of res) if (r) out[r[0]] = r[1];
      setModels(out);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (models !== null && handle !== null) continueRender(handle);
  }, [models, handle]);

  return models ?? {};
};
