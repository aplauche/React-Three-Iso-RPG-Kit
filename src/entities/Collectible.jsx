import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';

export default function Collectible({ id, position, gridPosition, metadata }) {
  const meshRef = useRef(null);
  const [collected, setCollected] = useState(false);
  const color = metadata?.color || 'gold';

  // Subscribe to player grid position and game actions
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const addScore = useGameStore((state) => state.addScore);
  const collectEntity = useGameStore((state) => state.collectEntity);

  useFrame((state) => {
    if (collected) return;

    // Simple grid-based collision check
    const isPlayerOnCollectible =
      playerGridPosition.row === gridPosition.row &&
      playerGridPosition.col === gridPosition.col;

    if (isPlayerOnCollectible) {
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
