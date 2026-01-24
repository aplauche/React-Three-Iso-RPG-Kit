import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';
import { levels } from '../levels';
import { isTileCollidable } from '../ground/groundColors';
import { isEntityCollidable } from '../entities';

export default function Player() {
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const setPlayerGridPosition = useGameStore((state) => state.setPlayerGridPosition);
  const setPlayerVisualPosition = useGameStore((state) => state.setPlayerVisualPosition);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const entityPositions = useGameStore((state) => state.entityPositions);
  const collectedEntities = useGameStore((state) => state.collectedEntities);

  // Get the current level data for ground grid
  const currentLevel = levels[currentLevelId];
  const groundGrid = currentLevel?.groundGrid;

  // Build collidable positions from Zustand entity positions
  const entityCollidablePositions = useMemo(() => {
    const positions = new Set();

    Object.values(entityPositions).forEach(entity => {
      // Skip collected entities
      if (collectedEntities.has(entity.id)) return;

      // Add collidable entities to the set
      if (isEntityCollidable(entity.type)) {
        const posKey = `${entity.position.row},${entity.position.col}`;
        positions.add(posKey);
      }
    });

    return positions;
  }, [entityPositions, collectedEntities]);

  const meshRef = useRef(null);

  // Current logical grid position
  const playerCurrentLocation = useRef(playerGridPosition);

  // Movement progress: 1 = just started moving, 0 = arrived at destination
  const subGridMovement = useRef(0);

  // Direction of current movement
  const moveDirection = useRef(null)

  // Keys currently held
  const keysHeld = useRef([]);

  // Movement speed (how much to decrement subGridMovement per frame)
  const MOVEMENT_SPEED = 0.02;

  // Keyboard handlers
  useEffect(() => {
    const keyMap = {
      'arrowup': 'up', 'w': 'up',
      'arrowdown': 'down', 's': 'down',
      'arrowleft': 'left', 'a': 'left',
      'arrowright': 'right', 'd': 'right',
    };

    const handleKeyDown = (e) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;

      // Only process if not already held (prevents repeat)
      if (keysHeld.current.includes(direction)) return;
      keysHeld.current.push(direction)
    };

    const handleKeyUp = (e) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;
      keysHeld.current = keysHeld.current.filter(val => val != direction)
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isValidCell = (pos) => {
    // Check bounds using groundGrid dimensions
    if (!groundGrid) return false;
    if (pos.row < 0 || pos.row >= groundGrid.length) return false;
    if (pos.col < 0 || pos.col >= groundGrid[0].length) return false;

    // Check entity collisions from Zustand
    if (entityCollidablePositions.has(`${pos.row},${pos.col}`)) return false;

    // Check tile collisions
    if (groundGrid[pos.row]?.[pos.col]) {
      const tileType = groundGrid[pos.row][pos.col];
      if (isTileCollidable(tileType)) return false;
    }

    return true;
  };

  const getNextCell = (from, dir) => {
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

    // Direct grid to world: col → x, row → z
    const targetPos = new THREE.Vector3(
      playerCurrentLocation.current.col,
      0.5,
      playerCurrentLocation.current.row
    );

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

    // Update visual position in store for camera tracking
    setPlayerVisualPosition(meshRef.current.position.clone());
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
