import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollisionWithObstacles, GameObject } from '../utils/collision';

interface PlayerProps {
  obstacles: GameObject[];
  onPositionChange?: (position: THREE.Vector3) => void;
}

export default function Player({ obstacles, onPositionChange }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(0, 0.5, 0));

  const SPEED = 0.1;
  const PLAYER_SIZE = new THREE.Vector3(1, 1, 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
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

    // Reset velocity
    velocity.current.set(0, 0, 0);

    // Calculate velocity based on keys pressed
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      velocity.current.z -= SPEED;
    }
    if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      velocity.current.z += SPEED;
    }
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      velocity.current.x -= SPEED;
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      velocity.current.x += SPEED;
    }

    // Calculate new position
    const newPosition = position.current.clone().add(velocity.current);

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

    // Update mesh position
    meshRef.current.position.copy(position.current);

    // Notify parent of position change for camera tracking
    if (onPositionChange) {
      onPositionChange(position.current);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
