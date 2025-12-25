import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './components/Player';
import Camera from './components/Camera';
import GroundMap from './components/GroundMap';
import EntityManager, { useEntityCollisionObjects } from './components/EntityManager';
import { levels } from './levels';
import { gridToWorld } from './utils/coordinateConversion';

function App() {
  const [currentLevelId, setCurrentLevelId] = useState('demo1');
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [score, setScore] = useState(0);
  const [collectedEntities, setCollectedEntities] = useState<Set<string>>(new Set());

  const currentLevel = levels[currentLevelId];

  // Grid dimensions for coordinate conversion
  const gridDimensions = useMemo(() => ({
    rows: currentLevel.groundGrid.length,
    cols: currentLevel.groundGrid[0]?.length || 0,
  }), [currentLevel]);

  // Filter out collected entities
  const activeEntities = useMemo(() => {
    return currentLevel.entities.filter(entity => {
      const entityId = `${entity.type}-${entity.position.row}-${entity.position.col}`;
      return !collectedEntities.has(entityId);
    });
  }, [currentLevel.entities, collectedEntities]);

  // Get collision objects from entities
  const obstacles = useEntityCollisionObjects(activeEntities, gridDimensions);

  // Handle collectible pickup
  const handleCollect = (entityId: string) => {
    const entity = activeEntities.find(e =>
      `${e.type}-${e.position.row}-${e.position.col}` === entityId
    );

    if (entity) {
      const points = entity.metadata?.points || 10;
      setScore(prev => prev + points);
      setCollectedEntities(prev => new Set(prev).add(entityId));
      console.log(`Collected item! +${points} points. Total: ${score + points}`);
    }
  };

  // Handle door entry (level transition)
  const handleDoorEnter = (entityId: string, targetLevel?: string) => {
    if (!targetLevel || !levels[targetLevel]) {
      console.warn(`Invalid target level: ${targetLevel}`);
      return;
    }

    const newLevel = levels[targetLevel];
    const newGridDimensions = {
      rows: newLevel.groundGrid.length,
      cols: newLevel.groundGrid[0]?.length || 0,
    };

    // Calculate new player position
    const newPosition = gridToWorld(newLevel.spawnPoint, newGridDimensions);
    newPosition.y = 0.5; // Player height

    setCurrentLevelId(targetLevel);
    setPlayerPosition(newPosition);
    setCollectedEntities(new Set()); // Reset collected items for new level

    console.log(`Transitioned to ${newLevel.name}`);
  };

  // Handle enemy collision
  const handleEnemyHit = (entityId: string) => {
    console.log(`Hit enemy! (${entityId})`);
    // TODO: Implement health system
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        zIndex: 1,
        fontFamily: 'monospace',
        fontSize: '16px',
        textShadow: '2px 2px 4px black',
        pointerEvents: 'none'
      }}>
        <div>Level: {currentLevel.name}</div>
        <div>Score: {score}</div>
        <div>Controls: WASD / Arrow Keys</div>
      </div>

      <Canvas
        orthographic
        shadows
        camera={{ position: [8, 10, 8], zoom: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Camera controller */}
        <Camera playerPosition={playerPosition} />

        {/* Ground tiles (visual only) */}
        <GroundMap groundGrid={currentLevel.groundGrid} />

        {/* Player */}
        <Player
          obstacles={obstacles}
          onPositionChange={setPlayerPosition}
          initialPosition={playerPosition}
        />

        {/* Entities (game objects with collision/behavior) */}
        <EntityManager
          entities={activeEntities}
          gridDimensions={gridDimensions}
          onCollect={handleCollect}
          onDoorEnter={handleDoorEnter}
          onEnemyHit={handleEnemyHit}
        />

        {/* Grid helper for debugging */}
        <gridHelper args={[50, 50]} />
      </Canvas>
    </div>
  );
}

export default App;
