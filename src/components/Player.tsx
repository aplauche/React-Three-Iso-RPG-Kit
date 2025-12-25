import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';
import { gridToWorld } from '../utils/coordinateConversion';
import { GridPosition } from '../types/tile';

interface PlayerProps {
  gridDimensions: { rows: number; cols: number };
  collidablePositions: Set<string>; // Set of "row,col" strings
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function Player({ gridDimensions, collidablePositions }: PlayerProps) {
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const setPlayerGridPosition = useGameStore((state) => state.setPlayerGridPosition);

  const meshRef = useRef<THREE.Mesh>(null);

  // Current grid position and target grid position for lerping
  const currentGridPos = useRef<GridPosition>(playerGridPosition);
  const targetGridPos = useRef<GridPosition>(playerGridPosition);

  // Current world position (for smooth rendering)
  const currentWorldPos = useRef<THREE.Vector3>(
    gridToWorld(playerGridPosition, gridDimensions)
  );

  // Movement state
  const isMoving = useRef(false);
  const keysHeld = useRef<Direction[]>([]);

  const LERP_SPEED = 0.2;

  // Update when level changes (reset position)
  useEffect(() => {
    currentGridPos.current = playerGridPosition;
    targetGridPos.current = playerGridPosition;
    currentWorldPos.current = gridToWorld(playerGridPosition, gridDimensions);
    isMoving.current = false;
  }, [playerGridPosition, gridDimensions]);

  // Keyboard handling
  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      'arrowup': 'up',
      'w': 'up',
      'arrowdown': 'down',
      's': 'down',
      'arrowleft': 'left',
      'a': 'left',
      'arrowright': 'right',
      'd': 'right',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;

      // Remove if already in array, then add to end
      keysHeld.current = keysHeld.current.filter(d => d !== direction);
      keysHeld.current.push(direction);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;
      keysHeld.current = keysHeld.current.filter(d => d !== direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Helper: Check if grid position is valid and not blocked
  const isValidMove = (gridPos: GridPosition): boolean => {
    // Check bounds
    if (gridPos.row < 0 || gridPos.row >= gridDimensions.rows) return false;
    if (gridPos.col < 0 || gridPos.col >= gridDimensions.cols) return false;

    // Check collisions
    const posKey = `${gridPos.row},${gridPos.col}`;
    if (collidablePositions.has(posKey)) return false;

    return true;
  };

  // Helper: Get next grid position based on direction
  const getNextGridPos = (current: GridPosition, direction: Direction): GridPosition => {
    switch (direction) {
      case 'up':
        return { row: current.row - 1, col: current.col };
      case 'down':
        return { row: current.row + 1, col: current.col };
      case 'left':
        return { row: current.row, col: current.col - 1 };
      case 'right':
        return { row: current.row, col: current.col + 1 };
    }
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // If not moving and a key is held, try to start movement
    if (!isMoving.current && keysHeld.current.length > 0) {
      const direction = keysHeld.current[keysHeld.current.length - 1];
      const nextPos = getNextGridPos(currentGridPos.current, direction);

      if (isValidMove(nextPos)) {
        targetGridPos.current = nextPos;
        isMoving.current = true;
      }
    }

    // If moving, lerp to target
    if (isMoving.current) {
      const targetWorldPos = gridToWorld(targetGridPos.current, gridDimensions);
      currentWorldPos.current.lerp(targetWorldPos, LERP_SPEED);

      // Check if we've reached the target
      const distance = currentWorldPos.current.distanceTo(targetWorldPos);
      if (distance < 0.01) {
        // Snap to target
        currentWorldPos.current.copy(targetWorldPos);
        currentGridPos.current = targetGridPos.current;
        isMoving.current = false;

        // Update Zustand store
        setPlayerGridPosition(currentGridPos.current);
      }
    }

    // Update mesh position
    meshRef.current.position.copy(currentWorldPos.current);
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
