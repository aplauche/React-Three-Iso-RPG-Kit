import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';
import { gridToWorld } from '../utils/coordinateConversion';
import { levels } from '../levels';

export default function Camera() {
  const { camera } = useThree();
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const currentLevelId = useGameStore((state) => state.currentLevelId);

  const targetPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    // Set initial camera rotation for isometric view
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    // Get current level for grid dimensions
    const currentLevel = levels[currentLevelId];
    const gridDimensions = {
      rows: currentLevel.groundGrid.length,
      cols: currentLevel.groundGrid[0]?.length || 0,
    };

    // Convert player grid position to world position
    const playerWorldPosition = gridToWorld(playerGridPosition, gridDimensions);

    // Isometric camera offset (looking down at an angle)
    const offset = new THREE.Vector3(8, 10, 8);

    // Calculate target position (player position + offset)
    targetPosition.current.copy(playerWorldPosition).add(offset);

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, 0.1);

    // Smoothly interpolate look-at target
    lookAtTarget.current.lerp(playerWorldPosition, 0.1);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
