import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Player from './components/Player';
import Camera from './components/Camera';
import GroundMap from './components/GroundMap';
import EntityManager from './components/EntityManager';
import { levels } from './levels';
import { useGameStore } from './store/useGameStore';
import { generateEntityId } from './entities';

function App() {
  // Subscribe to Zustand store
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const score = useGameStore((state) => state.score);
  const collectedEntities = useGameStore((state) => state.collectedEntities);

  const currentLevel = levels[currentLevelId];

  // Grid dimensions for coordinate conversion
  const gridDimensions = useMemo(() => ({
    rows: currentLevel.groundGrid.length,
    cols: currentLevel.groundGrid[0]?.length || 0,
  }), [currentLevel]);

  // Filter out collected entities
  const activeEntities = useMemo(() => {
    return currentLevel.entities.filter(entity => {
      const entityId = generateEntityId(entity.type, entity.position.row, entity.position.col);
      return !collectedEntities.has(entityId);
    });
  }, [currentLevel.entities, collectedEntities]);

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
        <Camera />

        {/* Ground tiles (visual only) */}
        <GroundMap groundGrid={currentLevel.groundGrid} />

        {/* Player */}
        <Player gridDimensions={gridDimensions} />

        {/* Entities (game objects with collision/behavior) */}
        <EntityManager
          entities={activeEntities}
          gridDimensions={gridDimensions}
        />

        {/* Grid helper for debugging */}
        <gridHelper args={[50, 50]} />
      </Canvas>
    </div>
  );
}

export default App;
