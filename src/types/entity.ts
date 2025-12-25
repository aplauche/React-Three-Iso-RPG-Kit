import * as THREE from 'three';
import { EntityType } from './level';

// 2D grid position
export interface GridPosition {
  row: number;
  col: number;
}

// Entity instance (runtime)
export interface EntityInstance {
  id: string;                      // Auto-generated: ${type}-${row}-${col}
  type: EntityType;
  position: THREE.Vector3;          // 3D world position
  gridPosition: GridPosition;       // 2D grid position
  size: THREE.Vector3;              // Collision box size
  isCollidable: boolean;            // Whether it blocks player movement
  metadata?: Record<string, any>;   // Custom properties
}

// Props for entity React components
export interface EntityProps {
  id: string;                      // Entity ID for tracking
  position: THREE.Vector3;         // 3D world position for rendering
  gridPosition: GridPosition;      // 2D grid position for collision
  metadata?: Record<string, any>;
}

// Collision callback context
export interface EntityCollisionContext {
  entityId: string;
  entityType: EntityType;
  player: {
    position: THREE.Vector3;
    size: THREE.Vector3;
  };
}
