import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollisionWithObstacles, GameObject } from '../utils/collision';
import { useGameStore } from '../store/useGameStore';

interface PlayerProps {
  obstacles: GameObject[];
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function Player({ obstacles }: PlayerProps) {
  const initialPosition = useGameStore((state) => state.playerPosition);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);

  const meshRef = useRef<THREE.Mesh>(null);
  const position = useRef(initialPosition.clone());

  // Track keys in order pressed (last = current direction)
  const keysHeld = useRef<Direction[]>([]);

  const SPEED = 0.05;
  const PLAYER_SIZE = new THREE.Vector3(1, 1, 1);

  // Update position when initialPosition changes (level transition)
  useEffect(() => {
    position.current.copy(initialPosition);
    if (meshRef.current) {
      meshRef.current.position.copy(initialPosition);
    }
  }, [initialPosition]);

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

      // Remove if already in array (to avoid duplicates)
      keysHeld.current = keysHeld.current.filter(d => d !== direction);
      // Add to end (most recent)
      keysHeld.current.push(direction);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const direction = keyMap[e.key.toLowerCase()];
      if (!direction) return;

      // Remove from array
      keysHeld.current = keysHeld.current.filter(d => d !== direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    // Get current direction (last key in array)
    const activeDirection = keysHeld.current[keysHeld.current.length - 1];

    if (activeDirection) {
      // Calculate velocity based on active direction
      const velocity = new THREE.Vector3();

      switch (activeDirection) {
        case 'up':
          velocity.z = -SPEED;
          break;
        case 'down':
          velocity.z = SPEED;
          break;
        case 'left':
          velocity.x = -SPEED;
          break;
        case 'right':
          velocity.x = SPEED;
          break;
      }

      // Calculate new position
      const newPosition = position.current.clone().add(velocity);

      // Check for collisions
      const playerObject: GameObject = {
        position: newPosition,
        size: PLAYER_SIZE,
      };

      const wouldCollide = checkCollisionWithObstacles(playerObject, obstacles);

      // Only update position if no collision
      if (!wouldCollide) {
        position.current.copy(newPosition);
      }
    }

    // Update mesh position
    meshRef.current.position.copy(position.current);

    // Update global store
    setPlayerPosition(position.current);
  });

  return (
    <mesh ref={meshRef} position={initialPosition.toArray()} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
