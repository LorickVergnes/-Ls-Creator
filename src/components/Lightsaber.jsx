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
      <axesHelper args={[20]} />
    </group>
  );
}

export default function Lightsaber({ config }) {
  // Nouveaux noms de props pour plus de clarté
  const { colors, showRingBottom, showRingTop } = config;

  // Calcul positions (Empilement)
  
  // 1. Pommel (Base)
  const pommelPos = [0, PIECE_HEIGHTS.pommel, 0]; 

  // 2. Ring Bottom (Anciennement Ring 1 - Près du pommeau)
  const ringBottomY = PIECE_HEIGHTS.pommel;
  const ringBottomPos = showRingBottom ? [0, ringBottomY, 0] : null;

  // 3. Body
  const bodyY = PIECE_HEIGHTS.pommel + (showRingBottom ? PIECE_HEIGHTS.ring : 0);
  const bodyPos = [0, bodyY, 0];

  // 4. Ring Top (Anciennement Ring 2 - Près de l'émetteur)
  const ringTopY = bodyY + PIECE_HEIGHTS.body;
  const ringTopPos = showRingTop ? [0, ringTopY, 0] : null;

  // 5. Emitter (Sommet)
  const emitterY = ringTopY + (showRingTop ? PIECE_HEIGHTS.ring : 0);
  const emitterPos = [0, emitterY, 0];

  return (
    <group dispose={null}>
      <gridHelper args={[500, 10]} position={[0, 0, 0]} />

      {/* Pommel */}
      <Part 
        name="Pommel"
        url="/models/pommel_v2.glb"
        color={colors.pommel || colors.global} 
        position={pommelPos} 
        height={PIECE_HEIGHTS.pommel}
        rotation={[Math.PI, 0, 0]} 
      />

      {/* Ring Bottom */}
      {showRingBottom && (
        <Part 
          name="Ring Bottom"
          url="/models/ring_v1.glb"
          color={colors.ringBottom || colors.global} 
          position={ringBottomPos} 
          height={PIECE_HEIGHTS.ring}
        />
      )}

      {/* Body */}
      <Part 
        name="Body"
        url="/models/body_v2.glb"
        color={colors.body || colors.global} 
        position={bodyPos} 
        height={PIECE_HEIGHTS.body}
      />

      {/* Ring Top */}
      {showRingTop && (
        <Part 
          name="Ring Top"
          url="/models/ring_v1.glb"
          color={colors.ringTop || colors.global} 
          position={ringTopPos} 
          height={PIECE_HEIGHTS.ring}
        />
      )}

      {/* Emitter */}
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
