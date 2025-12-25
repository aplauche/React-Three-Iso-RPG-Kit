import * as THREE from 'three';

interface ObstacleProps {
  position: THREE.Vector3;
}

export default function Obstacle({ position }: ObstacleProps) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
