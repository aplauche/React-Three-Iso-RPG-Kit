import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EntityProps } from '../types/entity';
import { useGameStore } from '../store/useGameStore';
import { checkAABBCollision, createAABB } from '../utils/collision';

export default function Door({
  position,
  size,
  metadata
}: EntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = metadata?.color || 'purple';
  const lastTransitionTime = useRef(0);

  // Subscribe to player state and transition action
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerSize = useGameStore((state) => state.playerSize);
  const transitionToLevel = useGameStore((state) => state.transitionToLevel);

  useFrame((state) => {
    // Gentle pulsing animation
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(1, scale, 1);
    }

    // Self-contained intersection handling
    const playerBox = createAABB({ position: playerPosition, size: playerSize });
    const entityBox = createAABB({ position, size });

    if (checkAABBCollision(playerBox, entityBox)) {
      // Debounce level transitions (prevent rapid re-triggering)
      const now = Date.now();
      if (now - lastTransitionTime.current < 1000) return; // 1 second cooldown

      const targetLevel = metadata?.targetLevel;
      if (targetLevel) {
        lastTransitionTime.current = now;
        transitionToLevel(targetLevel);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Visual indicator it's a portal */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
