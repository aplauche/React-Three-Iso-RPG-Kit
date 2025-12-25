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

  // Movement progress: 1 = just started moving, 0 = arrived at destination
  const [subGridMovement, setSubGridMovement] = useState(0);

  // Direction of current movement
  const moveDirection = useRef(null)

  // Keys currently held
  const keysHeld = useRef([]);

  // Movement speed (how much to decrement subGridMovement per frame)
  const MOVEMENT_SPEED = 0.01;

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
    if (!keysHeld.current || keysHeld.current.length < 1) return;


    if(subGridMovement == 0){
      moveDirection.current = keysHeld.current[-1]
      // Check if the target square is valid
      if(moveDirection.current){
        const nextCell = getNextCell(playerCurrentLocation.current, moveDirection.current);
        if (!isValidCell(nextCell)) return;
        playerCurrentLocation.current = nextCell;
        setPlayerGridPosition(nextCell);
        setSubGridMovement(1);
      }
    }

    // If we're moving, decrement subGridMovement
    if (subGridMovement > 0) {
      const newSubGridMovement = Math.max(0, subGridMovement - MOVEMENT_SPEED);
      setSubGridMovement(newSubGridMovement);

      // If we just finished moving, clear direction
      if (newSubGridMovement === 0) {
        moveDirection.current = null
      }
    }

    // Calculate visual position
    // Visual position = current location - (movement offset in the direction we came from)
    const targetPos = gridToWorld(playerCurrentLocation.current, gridDimensions);

    if (subGridMovement > 0 && moveDirection.current) {
      // Apply offset based on the direction we're moving
      const offset = new THREE.Vector3();
      switch (moveDirection.current) {
        case 'up':
          // Moving up (row decreases): came from higher row (higher z)
          offset.set(0, 0, 1).multiplyScalar(subGridMovement);
          break;
        case 'down':
          // Moving down (row increases): came from lower row (lower z)
          offset.set(0, 0, -1).multiplyScalar(subGridMovement);
          break;
        case 'left':
          // Moving left (col decreases): came from higher col (higher x)
          offset.set(1, 0, 0).multiplyScalar(subGridMovement);
          break;
        case 'right':
          // Moving right (col increases): came from lower col (lower x)
          offset.set(-1, 0, 0).multiplyScalar(subGridMovement);
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
