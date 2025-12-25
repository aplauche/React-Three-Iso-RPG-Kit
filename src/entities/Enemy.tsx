import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EntityProps } from '../types/entity';

export default function Enemy({ position, metadata }: EntityProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = metadata?.color || 'darkred';

  // Subtle bobbing animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
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
