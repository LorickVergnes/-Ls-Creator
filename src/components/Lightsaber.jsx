import React, { useMemo, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Dimensions en mm
const PIECE_HEIGHTS = {
  emitter: 64,
  body: 180,
  pommel: 34,
  ring: 10,
};

const BLENDER_SCALE = [1, 1, 1];

function Part({ url, color, position, scale = BLENDER_SCALE, height, name, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    let meshCount = 0;
    clonedScene.traverse((obj) => {
      if (obj.isMesh) meshCount++;
    });
    setIsEmpty(meshCount === 0);
  }, [clonedScene, url]);

  useMemo(() => {
    if (!isEmpty) {
      clonedScene.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.color.set(color);
        }
      });
    }
  }, [clonedScene, color, isEmpty]);

  if (isEmpty) {
    const radius = name.includes('Ring') ? 22 : 18; 
    return (
      <group position={position}>
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[radius, radius, height, 32]} />
          <meshStandardMaterial color={color} roughness={0.3} wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation}>
      <primitive object={clonedScene} scale={scale} />
      {/* Aide visuelle : Axes XYZ */}
      <axesHelper args={[20]} />
    </group>
  );
}

export default function Lightsaber({ config }) {
  const { colors, showRing1, showRing2 } = config;

  // Calcul positions (Empilement)
  const pommelPos = [0, PIECE_HEIGHTS.pommel, 0]; // Décalé vers le haut pour compenser la rotation
  const ring1Y = PIECE_HEIGHTS.pommel;
  const ring1Pos = showRing1 ? [0, ring1Y, 0] : null;
  const bodyY = PIECE_HEIGHTS.pommel + (showRing1 ? PIECE_HEIGHTS.ring : 0);
  const bodyPos = [0, bodyY, 0];
  const ring2Y = bodyY + PIECE_HEIGHTS.body;
  const ring2Pos = showRing2 ? [0, ring2Y, 0] : null;
  const emitterY = ring2Y + (showRing2 ? PIECE_HEIGHTS.ring : 0);
  const emitterPos = [0, emitterY, 0];

  return (
    <group dispose={null}>
      <gridHelper args={[500, 10]} position={[0, 0, 0]} />

      <Part 
        name="Pommel"
        url="/models/pommel_v2.glb"
        color={colors.pommel || colors.global} 
        position={pommelPos} 
        height={PIECE_HEIGHTS.pommel}
        rotation={[Math.PI, 0, 0]} // Rotation de 180 degrés sur l'axe X
      />

      {showRing1 && (
        <Part 
          name="Ring 1"
          url="/models/ring_v1.glb"
          color={colors.ring1 || colors.global} 
          position={ring1Pos} 
          height={PIECE_HEIGHTS.ring}
        />
      )}

      <Part 
        name="Body"
        url="/models/body_v2.glb"
        color={colors.body || colors.global} 
        position={bodyPos} 
        height={PIECE_HEIGHTS.body}
      />

      {showRing2 && (
        <Part 
          name="Ring 2"
          url="/models/ring_v1.glb"
          color={colors.ring2 || colors.global} 
          position={ring2Pos} 
          height={PIECE_HEIGHTS.ring}
        />
      )}

      <Part 
        name="Emitter"
        url="/models/emitter_v2.glb"
        color={colors.emitter || colors.global} 
        position={emitterPos} 
        height={PIECE_HEIGHTS.emitter}
      />
    </group>
  );
}

// Préchargement avec les noms de fichiers actuels
useGLTF.preload('/models/pommel_v2.glb');
useGLTF.preload('/models/ring_v1.glb');
useGLTF.preload('/models/body_v2.glb');
useGLTF.preload('/models/emitter_v2.glb');
