import * as THREE from 'three';
import { GridPosition } from '../types/entity';

/**
 * Configuration for grid-to-world conversion
 */
export interface GridConfig {
  tileSize: number;      // Size of each tile (default: 1)
  heightOffset: number;  // Y position for tiles (default: 0.5)
  originOffset: THREE.Vector2; // Offset to center the grid
}

const DEFAULT_CONFIG: GridConfig = {
  tileSize: 1,
  heightOffset: 0.5,
  originOffset: new THREE.Vector2(0, 0),
};

/**
 * Converts 2D grid position to 3D world position
 * For isometric:
 *   - row increases -> z increases (going "down" visually)
 *   - col increases -> x increases (going "right" visually)
 */
export function gridToWorld(
  gridPos: GridPosition,
  gridDimensions: { rows: number; cols: number },
  config: Partial<GridConfig> = {}
): THREE.Vector3 {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Center the grid around origin
  const centerRow = (gridDimensions.rows - 1) / 2;
  const centerCol = (gridDimensions.cols - 1) / 2;

  // Calculate world position
  const x = (gridPos.col - centerCol) * cfg.tileSize + cfg.originOffset.x;
  const z = (gridPos.row - centerRow) * cfg.tileSize + cfg.originOffset.y;
  const y = cfg.heightOffset;

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts 3D world position to 2D grid position (inverse operation)
 */
export function worldToGrid(
  worldPos: THREE.Vector3,
  gridDimensions: { rows: number; cols: number },
  config: Partial<GridConfig> = {}
): GridPosition {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const centerRow = (gridDimensions.rows - 1) / 2;
  const centerCol = (gridDimensions.cols - 1) / 2;

  const col = Math.round((worldPos.x - cfg.originOffset.x) / cfg.tileSize + centerCol);
  const row = Math.round((worldPos.z - cfg.originOffset.y) / cfg.tileSize + centerRow);

  return { row, col };
}
