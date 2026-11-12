import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';
import {baconMap, crustBump, crustMap, pattyBump, pattyMap, plainBunMap, woodMap} from './textures';

const R = 1.72; // radio del pan

// UV planar (vista desde arriba) para que la costra se vea como en la foto.
const planarUV = (geo: THREE.BufferGeometry, radius: number) => {
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) / radius + 1) / 2;
    uv[i * 2 + 1] = (pos.getZ(i) / radius + 1) / 2;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
};

export const TopBun: React.FC = () => {
  const geo = useMemo(
    () => planarUV(new THREE.SphereGeometry(R, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), R),
    [],
  );
  return (
    <group>
      <mesh geometry={geo} scale={[1, 0.62, 1]} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={crustMap()}
          bumpMap={crustBump()}
          bumpScale={2.4}
          roughness={0.5}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial color="#efd29a" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const BottomBun: React.FC = () => {
  const geo = useMemo(
    () => planarUV(new THREE.SphereGeometry(R, 96, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), R),
    [],
  );
  return (
    <group position={[0, 0.55, 0]}>
      <mesh geometry={geo} scale={[1, 0.32, 1]} castShadow receiveShadow>
        <meshStandardMaterial map={plainBunMap()} roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial color="#efd29a" roughness={0.9} />
      </mesh>
    </group>
  );
};

export const Sauce: React.FC = () => {
  const drips = useMemo(
    () =>
      Array.from({length: 7}, (_, i) => {
        const a = random(`drip-a-${i}`) * Math.PI * 2;
        return {
          x: Math.cos(a) * 1.5,
          z: Math.sin(a) * 1.5,
          s: 0.1 + random(`drip-s-${i}`) * 0.1,
        };
      }),
    [],
  );
  return (
    <group>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 64]} />
        <meshPhysicalMaterial color="#e89a68" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      {drips.map((d, i) => (
        <mesh key={i} position={[d.x, 0.0, d.z]} scale={[1, 0.8, 1]} castShadow>
          <sphereGeometry args={[d.s, 16, 12]} />
          <meshPhysicalMaterial color="#e89a68" roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const Patty: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1.48, 1.5, 0.4, 96, 4);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const a = Math.atan2(z, x);
      const k = 1 + 0.035 * Math.sin(a * 5 + 1.3) + 0.02 * Math.sin(a * 11);
      p.setX(i, x * k);
      p.setZ(i, z * k);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[0, 0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={pattyMap()} bumpMap={pattyBump()} bumpScale={2.2} roughness={0.55} />
    </mesh>
  );
};

export const Cheese: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(3.1, 3.1, 56, 56);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const r = Math.hypot(x, z);
      const droop = Math.pow(Math.max(0, r - 1.35), 1.4) * 0.6;
      const ripple = Math.sin(x * 4.2) * Math.cos(z * 3.6) * 0.025;
      p.setY(i, -droop + ripple);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#f2a000"
        roughness={0.4}
        clearcoat={0.7}
        clearcoatRoughness={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const Onions: React.FC = () => {
  const rings = useMemo(
    () =>
      Array.from({length: 15}, (_, i) => {
        const a = random(`on-a-${i}`) * Math.PI * 2;
        const d = Math.sqrt(random(`on-d-${i}`)) * 1.0;
        return {
          x: Math.cos(a) * d,
          z: Math.sin(a) * d,
          y: 0.09 + random(`on-y-${i}`) * 0.05,
          r: 0.3 + random(`on-r-${i}`) * 0.3,
          arc: 1.5 + random(`on-arc-${i}`) * 1.8,
          rot: random(`on-rot-${i}`) * Math.PI * 2,
          tiltX: (random(`on-tx-${i}`) - 0.5) * 0.6,
          tiltZ: (random(`on-tz-${i}`) - 0.5) * 0.6,
          tone: random(`on-tone-${i}`),
        };
      }),
    [],
  );
  return (
    <group>
      {rings.map((o, i) => (
        <mesh
          key={i}
          position={[o.x, o.y, o.z]}
          rotation={[Math.PI / 2 + o.tiltX, o.tiltZ, o.rot]}
          scale={[1, 1, 0.5]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[o.r, 0.11, 12, 28, o.arc]} />
          <meshPhysicalMaterial
            color={o.tone > 0.5 ? '#cf8a33' : '#b46f24'}
            roughness={0.3}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const BaconStrip: React.FC<{readonly rot: number; readonly dx: number; readonly dz: number; readonly dy: number; readonly phase: number}> = ({
  rot,
  dx,
  dz,
  dy,
  phase,
}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(3.2, 0.5, 80, 8);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, Math.sin(x * 4.2 + phase) * 0.07 + Math.sin(x * 9 + phase * 2) * 0.02 + z * 0.05);
      p.setZ(i, z * (1 + 0.12 * Math.sin(x * 5 + phase)));
    }
    g.computeVertexNormals();
    return g;
  }, [phase]);
  return (
    <mesh geometry={geo} position={[dx, dy, dz]} rotation={[0, rot, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial map={baconMap()} roughness={0.4} clearcoat={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
};

export const Bacon: React.FC = () => (
  <group>
    <BaconStrip rot={0.35} dx={0.1} dz={-0.55} dy={0.04} phase={0.3} />
    <BaconStrip rot={-0.25} dx={-0.1} dz={0.35} dy={0.07} phase={1.7} />
    <BaconStrip rot={1.2} dx={0.2} dz={0.05} dy={0.1} phase={3.1} />
  </group>
);

export const Egg: React.FC = () => {
  const {white, edge} = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 72;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 1.55 + 0.16 * Math.sin(a * 3 + 0.8) + 0.1 * Math.sin(a * 5 + 2.1) + 0.05 * Math.sin(a * 9);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const opts = {depth: 0.05, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 48};
    const w = new THREE.ExtrudeGeometry(shape, opts);
    w.rotateX(-Math.PI / 2);
    const e = new THREE.ExtrudeGeometry(shape, {...opts, depth: 0.03});
    e.rotateX(-Math.PI / 2);
    return {white: w, edge: e};
  }, []);
  return (
    <group>
      <mesh geometry={edge} position={[0, -0.01, 0]} scale={[1.04, 1, 1.04]} castShadow>
        <meshPhysicalMaterial color="#d9a45a" roughness={0.45} />
      </mesh>
      <mesh geometry={white} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#fff7ea" roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.15} />
      </mesh>
      <mesh position={[0.1, 0.12, -0.05]} scale={[1, 0.28, 1]} castShadow>
        <sphereGeometry args={[0.4, 32, 20]} />
        <meshPhysicalMaterial color="#f2c13f" roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </group>
  );
};

export const Board: React.FC = () => (
  <mesh position={[0, -0.12, 0]} receiveShadow>
    <cylinderGeometry args={[2.9, 2.9, 0.24, 96]} />
    <meshStandardMaterial map={woodMap()} roughness={0.8} />
  </mesh>
);
