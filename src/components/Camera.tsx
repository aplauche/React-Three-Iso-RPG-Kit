import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraProps {
  playerPosition: THREE.Vector3;
}

export default function Camera({ playerPosition }: CameraProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    // Set initial camera rotation for isometric view
    // Look at origin initially to establish the angle
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    // Isometric camera offset (looking down at an angle)
    const offset = new THREE.Vector3(8, 10, 8);

    // Calculate target position (player position + offset)
    targetPosition.current.copy(playerPosition).add(offset);

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, 0.1);

    // Smoothly interpolate look-at target to avoid twisting
    lookAtTarget.current.lerp(playerPosition, 0.1);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
