import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { GroundType } from '../types/level';
import { GroundTileProps } from '../types/ground';
import { gridToWorld } from '../utils/coordinateConversion';
import { GROUND_COLORS, DEFAULT_GROUND_COLOR } from '../ground/groundColors';

interface GroundMapProps {
  groundGrid: GroundType[][];
}

// Texture loader component - only loads when needed
function TexturedGroundTile({ position, groundType, color }: { position: THREE.Vector3; groundType: string; color: string }) {
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
function GroundTile({ position, color, groundType }: GroundTileProps & { groundType: string }) {
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
export default function GroundMap({ groundGrid }: GroundMapProps) {
  const groundTiles = useMemo(() => {
    const tiles: Array<{ position: THREE.Vector3; color: string; key: string; groundType: string }> = [];
    const gridDimensions = {
      rows: groundGrid.length,
      cols: groundGrid[0]?.length || 0
    };

    groundGrid.forEach((row, rowIndex) => {
      row.forEach((groundType, colIndex) => {
        const gridPosition = { row: rowIndex, col: colIndex };
        const worldPosition = gridToWorld(gridPosition, gridDimensions);

        // Ground tiles sit on the ground (y=0.05 for height 0.1)
        worldPosition.y = 0.05;

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
          gridPosition={{ row: 0, col: 0 }} // Not used for ground tiles
          color={tile.color}
          groundType={tile.groundType}
        />
      ))}
    </>
  );
}
