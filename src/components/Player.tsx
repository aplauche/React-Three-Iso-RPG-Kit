import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';
import { gridToWorld } from '../utils/coordinateConversion';
import { GridPosition } from '../types/tile';

interface PlayerProps {
  gridDimensions: { rows: number; cols: number };
  collidablePositions: Set<string>;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function Player({ gridDimensions, collidablePositions }: PlayerProps) {
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const setPlayerGridPosition = useGameStore((state) => state.setPlayerGridPosition);

  const meshRef = useRef<THREE.Mesh>(null);

  // Current logical grid position
  const playerCurrentLocation = useRef<GridPosition>(playerGridPosition);

  // Movement progress: 1 = just started moving, 0 = arrived at destination (use ref for synchronous updates)
  const subGridMovement = useRef(0);

  // Direction of current movement
  const moveDirection = useRef(null)

  // Keys currently held
  const keysHeld = useRef([]);

  // Movement speed (how much to decrement subGridMovement per frame)
  const MOVEMENT_SPEED = 0.02;

  // Reset on level change
  // useEffect(() => {
  //   playerCurrentLocation.current = playerGridPosition;
  //   setSubGridMovement(0);
  //   setMoveDirection([])
  // }, [playerGridPosition]);

  // Keyboard handlers
  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      'arrowup': 'up', 'w': 'up',
      'arrowdown': 'down', 's': 'down',
      'arrowleft': 'left', 'a': 'left',
      'arrowright': 'right', 'd': 'right',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;

      // Only process if not already held (prevents repeat)
      if (keysHeld.current.includes(direction)) return;
      keysHeld.current.push(direction)

      console.log("new key: " + keysHeld.current)

    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;
      keysHeld.current = keysHeld.current.filter(val => val != direction)
      console.log("removed key: " + keysHeld.current)
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isValidCell = (pos: GridPosition): boolean => {
    if (pos.row < 0 || pos.row >= gridDimensions.rows) return false;
    if (pos.col < 0 || pos.col >= gridDimensions.cols) return false;
    return !collidablePositions.has(`${pos.row},${pos.col}`);
  };

  const getNextCell = (from: GridPosition, dir: Direction): GridPosition => {
    switch (dir) {
      case 'up': return { row: from.row - 1, col: from.col };
      case 'down': return { row: from.row + 1, col: from.col };
      case 'left': return { row: from.row, col: from.col - 1 };
      case 'right': return { row: from.row, col: from.col + 1 };
    }
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // Check if we can start a new movement
    if (subGridMovement.current === 0 && keysHeld.current.length > 0) {
      const direction = keysHeld.current[keysHeld.current.length - 1];
      const nextCell = getNextCell(playerCurrentLocation.current, direction);

      if (isValidCell(nextCell)) {
        playerCurrentLocation.current = nextCell;
        setPlayerGridPosition(nextCell);
        moveDirection.current = direction;
        subGridMovement.current = 1;
      }
    }

    // Always decrement movement if we're moving
    if (subGridMovement.current > 0) {
      subGridMovement.current = Math.max(0, subGridMovement.current - MOVEMENT_SPEED);

      if (subGridMovement.current === 0) {
        moveDirection.current = null;
      }
    }

    // Always update visual position
    const targetPos = gridToWorld(playerCurrentLocation.current, gridDimensions);

    if (subGridMovement.current > 0 && moveDirection.current) {
      const offset = new THREE.Vector3();
      switch (moveDirection.current) {
        case 'up':
          offset.set(0, 0, -1).multiplyScalar(subGridMovement.current);
          break;
        case 'down':
          offset.set(0, 0, 1).multiplyScalar(subGridMovement.current);
          break;
        case 'left':
          offset.set(-1, 0, 0).multiplyScalar(subGridMovement.current);
          break;
        case 'right':
          offset.set(1, 0, 0).multiplyScalar(subGridMovement.current);
          break;
      }
      meshRef.current.position.copy(targetPos).sub(offset);
    } else {
      meshRef.current.position.copy(targetPos);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
