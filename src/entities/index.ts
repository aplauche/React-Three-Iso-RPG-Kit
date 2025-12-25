import * as THREE from 'three';
import { EntityType } from '../types/level';
import Enemy from './Enemy';
import Collectible from './Collectible';
import Door from './Door';

// Entity size configurations
export const ENTITY_SIZES: Record<EntityType, THREE.Vector3> = {
  'enemy': new THREE.Vector3(0.8, 0.8, 0.8),
  'collectible': new THREE.Vector3(0.6, 0.6, 0.6),
  'door': new THREE.Vector3(0.5, 0.2, 0.5), // Smaller collision box - must be in same cell
};

// Entity collision configurations
export const ENTITY_COLLIDABLE: Record<EntityType, boolean> = {
  'enemy': true,    // Enemies block movement
  'collectible': false,  // Can walk through collectibles
  'door': false,    // Can walk through doors
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

// Get entity size by type
export function getEntitySize(type: EntityType): THREE.Vector3 {
  return ENTITY_SIZES[type].clone();
}

// Check if entity is collidable
export function isEntityCollidable(type: EntityType): boolean {
  return ENTITY_COLLIDABLE[type];
}

// Generate entity ID from definition
export function generateEntityId(type: EntityType, row: number, col: number): string {
  return `${type}-${row}-${col}`;
}
