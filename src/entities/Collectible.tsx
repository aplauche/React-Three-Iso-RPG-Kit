import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EntityProps } from '../types/entity';
import { useGameStore } from '../store/useGameStore';
import { checkAABBCollision, createAABB } from '../utils/collision';

export default function Collectible({
  id,
  position,
  size,
  metadata
}: EntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);
  const color = metadata?.color || 'gold';

  // Subscribe to player state
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerSize = useGameStore((state) => state.playerSize);
  const addScore = useGameStore((state) => state.addScore);
  const collectEntity = useGameStore((state) => state.collectEntity);

  useFrame((state) => {
    if (collected) return;

    // Self-contained intersection handling
    const playerBox = createAABB({ position: playerPosition, size: playerSize });
    const entityBox = createAABB({ position, size });

    if (checkAABBCollision(playerBox, entityBox)) {
      const points = metadata?.points || 10;
      addScore(points);
      collectEntity(id);
      setCollected(true);
      console.log(`Collected! +${points} points`);
    }

    // Visual animation
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}
