import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Player from './components/Player';
import Camera from './components/Camera';
import GroundMap from './components/GroundMap';
import EntityManager from './components/EntityManager';
import { levels } from './levels';
import { useGameStore } from './store/useGameStore';

function App() {
  // Subscribe to Zustand store
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const score = useGameStore((state) => state.score);
  const health = useGameStore((state) => state.health);
  const initializeEntities = useGameStore((state) => state.initializeEntities);

  const currentLevel = levels[currentLevelId];

  // Initialize entities when level changes
  useEffect(() => {
    initializeEntities(currentLevel.entities);
  }, [currentLevelId, currentLevel.entities, initializeEntities]);

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
        <div>Health: {health}</div>
        <div>Score: {score}</div>
        <div>Controls: WASD / Arrow Keys</div>
      </div>

      <Canvas
        key={currentLevelId}
        orthographic
        shadows
        camera={{ position: [8, 10, 8], zoom: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#87CEEB']} />

        {/* Lighting - consistent across all levels */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
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
        <Player />

        {/* Entities (game objects with collision/behavior) */}
        <EntityManager />

        {/* Grid helper for debugging */}
        {/* <gridHelper args={[50, 50]} /> */}
      </Canvas>
    </div>
  );
}

export default App;
