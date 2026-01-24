import Enemy from './Enemy';
import Collectible from './Collectible';
import Door from './Door';

// Entity collision configurations (which entities block player movement)
export const ENTITY_COLLIDABLE = {
  'enemy': false,        // Enemies don't block movement (deal damage on contact)
  'collectible': false,  // Can walk through collectibles
  'door': false,         // Can walk through doors
};

// Entity component mapping
export const ENTITY_COMPONENTS = {
  'enemy': Enemy,
  'collectible': Collectible,
  'door': Door,
};

// Get entity component by type
export function getEntityComponent(type) {
  return ENTITY_COMPONENTS[type];
}

// Check if entity is collidable (blocks player movement)
export function isEntityCollidable(type) {
  return ENTITY_COLLIDABLE[type];
}

// Generate entity ID from grid position
export function generateEntityId(type, row, col) {
  return `${type}-${row}-${col}`;
}
