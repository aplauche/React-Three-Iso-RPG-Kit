import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { SpriteAnimator } from '@react-three/drei';


export default function Enemy({ position, gridPosition, metadata }) {
  const meshRef = useRef(null);
  const color = metadata?.color || 'darkred';
  const lastHitTime = useRef(0);

  // Subscribe to player grid position and takeDamage action
  const playerGridPosition = useGameStore((state) => state.playerGridPosition);
  const takeDamage = useGameStore((state) => state.takeDamage);

  useFrame((state) => {
    // Subtle bobbing animation
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // Check if player is on the same tile as enemy
    const isPlayerOnEnemy =
      playerGridPosition.row === gridPosition.row &&
      playerGridPosition.col === gridPosition.col;

    if (isPlayerOnEnemy) {
      // Debounce damage - only apply every 1 second while colliding
      const now = Date.now();
      if (now - lastHitTime.current < 1000) return;

      const damage = 10; // Fixed 10 damage per tick
      lastHitTime.current = now;

      takeDamage(damage);
      console.log(`Hit by enemy! -${damage} health`);
    }
  });

  return (
    <SpriteAnimator
      ref={meshRef} 
      position={position}
      startFrame={0}
      endFrame={6}              // 7 frames (0-6)
      fps={15}                  // ~467ms total duration
      loop={true}              // Play once only
      autoPlay={true}           // Start immediately
      textureImageURL="/assets/sprites/explosion.png"
      textureDataURL="/assets/sprites/explosion.json"
      // onEnd={onComplete}        // Cleanup callback
      asSprite={true}      // Face camera
      alphaTest={0.1}          // Prevent edge artifacts
      scale={1}
    />
    // <mesh ref={meshRef} position={position} castShadow>
    //   <sphereGeometry args={[0.4, 16, 16]} />
    //   <meshStandardMaterial
    //     color={color}
    //     emissive={color}
    //     emissiveIntensity={0.4}
    //   />
    // </mesh>
  );
}
