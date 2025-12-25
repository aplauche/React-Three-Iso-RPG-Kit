import { GridPosition } from './entity';

// Ground types (character representing texture/color)
export type GroundType = string;

// Entity types
export type EntityType = 'enemy' | 'collectible' | 'door';

// Entity definition (in level data)
export interface EntityDefinition {
  type: EntityType;
  position: GridPosition;
  metadata?: Record<string, any>;
}

// Level definition
export interface LevelDefinition {
  id: string;
  name: string;
  groundGrid: GroundType[][];      // Visual ground only (no collision)
  entities: EntityDefinition[];    // Game objects with behavior/collision
  spawnPoint: GridPosition;        // Where player spawns
  metadata?: Record<string, any>;  // Level-specific data
}
