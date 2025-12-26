import { EntityType } from '../types/level';
import Enemy from './Enemy';
import Collectible from './Collectible';
import Door from './Door';

// Entity collision configurations (which entities block player movement)
export const ENTITY_COLLIDABLE: Record<EntityType, boolean> = {
  'enemy': false,        // Enemies don't block movement (deal damage on contact)
  'collectible': false,  // Can walk through collectibles
  'door': false,         // Can walk through doors
};

// Entity component mapping
export const ENTITY_COMPONENTS: Record<EntityType, React.ComponentType<any>> = {
  'enemy': Enemy,
  'collectible': Collectible,
  'door': Door,
};

// Get entity component by type
export function getEntityComponent(type: EntityType) {
  return ENTITY_COMPONENTS[type];
}

// Check if entity is collidable (blocks player movement)
export function isEntityCollidable(type: EntityType): boolean {
  return ENTITY_COLLIDABLE[type];
}

// Generate entity ID from grid position
export function generateEntityId(type: EntityType, row: number, col: number): string {
  return `${type}-${row}-${col}`;
}
