import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EntityProps } from '../types/entity';
import { useGameStore } from '../store/useGameStore';

export default function Enemy({ position, gridPosition, metadata }: EntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = metadata?.color || 'darkred';
  const lastHitTime = useRef(0);

  // Subscribe to player grid position
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);

  useFrame((state) => {
    // Subtle bobbing animation
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Simple grid-based collision check
    const isPlayerOnEnemy =
      playerGridPosition.row === gridPosition.row &&
      playerGridPosition.col === gridPosition.col;

    if (isPlayerOnEnemy) {
      // Debounce damage (prevent rapid repeated hits)
      const now = Date.now();
      if (now - lastHitTime.current < 1000) return;

      const damage = metadata?.damage || 1;
      lastHitTime.current = now;

      console.log(`Hit by enemy! -${damage} health`);
      // TODO: Implement health system in useGameStore
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
