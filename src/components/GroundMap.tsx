import { useMemo } from 'react';
import * as THREE from 'three';
import { GroundType } from '../types/level';
import { GroundTileProps } from '../types/ground';
import { gridToWorld } from '../utils/coordinateConversion';
import { GROUND_COLORS, DEFAULT_GROUND_COLOR } from '../ground/groundColors';

interface GroundMapProps {
  groundGrid: GroundType[][];
}

// Individual ground tile component
function GroundTile({ position, color }: GroundTileProps) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Main ground map component
export default function GroundMap({ groundGrid }: GroundMapProps) {
  const groundTiles = useMemo(() => {
    const tiles: Array<{ position: THREE.Vector3; color: string; key: string }> = [];
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
        />
      ))}
    </>
  );
}
