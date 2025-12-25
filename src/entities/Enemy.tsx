import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EntityProps } from '../types/entity';
import { useGameStore } from '../store/useGameStore';
import { checkAABBCollision, createAABB } from '../utils/collision';

export default function Enemy({
  position,
  size,
  metadata
}: EntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = metadata?.color || 'darkred';
  const lastHitTime = useRef(0);

  // Subscribe to player state
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerSize = useGameStore((state) => state.playerSize);

  useFrame((state) => {
    // Subtle bobbing animation
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Self-contained intersection handling
    const playerBox = createAABB({ position: playerPosition, size: playerSize });
    const entityBox = createAABB({ position, size });

    if (checkAABBCollision(playerBox, entityBox)) {
      // Debounce damage (prevent rapid repeated hits)
      const now = Date.now();
      if (now - lastHitTime.current < 1000) return; // 1 second cooldown

      const damage = metadata?.damage || 1;
      lastHitTime.current = now;

      console.log(`Hit by enemy! -${damage} health`);
      // TODO: Implement health system in useGameStore
      // damagePlayer(damage);
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}
