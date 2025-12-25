import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './components/Player';
import Ground from './components/Ground';
import Obstacle from './components/Obstacle';
import Camera from './components/Camera';
import { GameObject } from './utils/collision';

function App() {
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));

  // Define obstacles
  const obstacles: GameObject[] = [
    {
      position: new THREE.Vector3(3, 0.5, 0),
      size: new THREE.Vector3(1, 1, 1),
    },
    {
      position: new THREE.Vector3(-3, 0.5, -5),
      size: new THREE.Vector3(1, 1, 1),
    },
    {
      position: new THREE.Vector3(5, 0.5, -8),
      size: new THREE.Vector3(1, 1, 1),
    },
    {
      position: new THREE.Vector3(-2, 0.5, 4),
      size: new THREE.Vector3(1, 1, 1),
    },
  ];

  return (
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

      {/* Scene objects */}
      <Ground />
      <Player obstacles={obstacles} onPositionChange={setPlayerPosition} />

      {/* Render obstacles */}
      {obstacles.map((obstacle, index) => (
        <Obstacle key={index} position={obstacle.position} />
      ))}

      {/* Grid helper for debugging */}
      <gridHelper args={[50, 50]} />
    </Canvas>
  );
}

export default App;
