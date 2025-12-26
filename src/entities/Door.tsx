import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EntityProps } from '../types/entity';
import { useGameStore } from '../store/useGameStore';

export default function Door({ position, gridPosition, metadata }: EntityProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lastTransitionTime = useRef(0);

  // Subscribe to player grid position and transition action
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const transitionToLevel = useGameStore((state) => state.transitionToLevel);

  useFrame((state) => {
    // Gentle pulsing animation
    if (groupRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.set(1, scale, 1);
    }

    // Simple grid-based collision check
    const isPlayerOnDoor =
      playerGridPosition.row === gridPosition.row &&
      playerGridPosition.col === gridPosition.col;

    if (isPlayerOnDoor) {
      // Debounce level transitions (prevent rapid re-triggering)
      const now = Date.now();
      if (now - lastTransitionTime.current < 1000) return;

      const targetLevel = metadata?.targetLevel;
      if (targetLevel) {
        lastTransitionTime.current = now;
        transitionToLevel(targetLevel);
      }
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Bottom step */}
      <mesh position={[0, 0.05, 0.15]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.3]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Middle step */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.3]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Top step */}
      <mesh position={[0, 0.25, -0.15]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.3]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  );
}
