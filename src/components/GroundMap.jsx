import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { GROUND_COLORS, DEFAULT_GROUND_COLOR } from '../ground/groundColors';

// Texture loader component - only loads when needed
function TexturedGroundTile({ position, groundType, color }) {
  const textures = useTexture({
    grass: '/src/assets/tile-textures/grass.jpg',
    water: '/src/assets/tile-textures/water.jpg',
  });

  const texture = groundType === 'g' ? textures.grass : textures.water;

  // Configure texture wrapping
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh position-y={-0.5} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Individual ground tile component
function GroundTile({ position, color, groundType }) {
  // Use textured version for grass and water
  if (groundType === 'g' || groundType === 'w') {
    return <TexturedGroundTile position={position} groundType={groundType} color={color} />;
  }

  // Use color for other tile types
  return (
     <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-y={-0.5} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Main ground map component
export default function GroundMap({ groundGrid }) {
  const groundTiles = useMemo(() => {
    const tiles = [];

    groundGrid.forEach((row, rowIndex) => {
      row.forEach((groundType, colIndex) => {
        // Direct grid to world: col → x, row → z
        const worldPosition = new THREE.Vector3(colIndex, 0.05, rowIndex);

        // Get color for this ground type
        const color = GROUND_COLORS[groundType] || DEFAULT_GROUND_COLOR;

        tiles.push({
          position: worldPosition,
          color,
          groundType,
          key: `ground-${rowIndex}-${colIndex}`
        });
      });
    });

    return tiles;
  }, [groundGrid]);

  return (
    <>
      {groundTiles.map(tile => (
        <GroundTile
          key={tile.key}
          position={tile.position}
          color={tile.color}
          groundType={tile.groundType}
        />
      ))}
    </>
  );
}
