import React, {useLayoutEffect} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bacon, Board, BottomBun, Cheese, Egg, Onions, Patty, Sauce, TopBun} from './Layers';
import {camAt, FOV, groupRotY, LAYERS, layerRotY, layerY, type LayerKey} from './rig';

const Rig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  const c = camAt(frame);
  camera.position.set(c.pos[0], c.pos[1], c.pos[2]);
  camera.lookAt(c.look[0], c.look[1], c.look[2]);
  camera.updateMatrixWorld(true);
  return null;
};

const Studio: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.32;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

const parts: Record<LayerKey, React.ReactNode> = {
  bottom: <BottomBun />,
  sauce: <Sauce />,
  patty: <Patty />,
  cheese: <Cheese />,
  onion: <Onions />,
  bacon: <Bacon />,
  egg: <Egg />,
  top: <TopBun />,
};

export const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      camera={{fov: FOV, near: 0.1, far: 100, position: [0, 4, 15]}}
      gl={{alpha: true, antialias: true}}
    >
      <Rig />
      <Studio />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[5, 11, 7]}
        intensity={1.5}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={11}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 5, -7]} intensity={1.8} color="#ff5a3c" />
      <pointLight position={[-4, 2, 6]} intensity={18} color="#ffb070" distance={20} />

      <Board />
      <group rotation={[0, groupRotY(frame), 0]}>
        {LAYERS.map((l) => (
          <group key={l.key} position={[0, layerY(frame, l), 0]} rotation={[0, layerRotY(frame, l), 0]}>
            {parts[l.key]}
          </group>
        ))}
      </group>
    </ThreeCanvas>
  );
};
