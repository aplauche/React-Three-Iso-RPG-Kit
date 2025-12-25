import { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

export default function Camera() {
  const { camera } = useThree();
  const playerVisualPosition = useGameStore((state) => state.playerVisualPosition);

  useEffect(() => {
    // Set initial camera rotation for isometric view
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    // Isometric camera offset (looking down at an angle)
    const offset = new THREE.Vector3(8, 10, 8);

    // Lock camera to player visual position (no smoothing)
    camera.position.copy(playerVisualPosition).add(offset);
    camera.lookAt(playerVisualPosition);
  });

  return null;
}
