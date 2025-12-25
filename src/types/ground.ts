import * as THREE from 'three';
import { GridPosition } from './entity';

// Props for ground tile components
export interface GroundTileProps {
  position: THREE.Vector3;
  gridPosition: GridPosition;
  color: string;
}
