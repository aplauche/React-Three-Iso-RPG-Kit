import { create } from 'zustand';
import { levels } from '../levels';
import * as THREE from 'three';

// Helper to generate entity ID
const generateEntityId = (type, row, col) => `${type}-${row}-${col}`;

export const useGameStore = create((set, get) => ({
  // Initial player state (grid position)
  playerGridPosition: { row: 1, col: 1 }, // demo1 spawn point
  setPlayerGridPosition: (position) => set({ playerGridPosition: position }),

  // Initial visual position
  playerVisualPosition: new THREE.Vector3(0, 0.5, 0),
  setPlayerVisualPosition: (position) => set({ playerVisualPosition: position }),

  // Entity positions - keyed by entity ID
  entityPositions: {},

  // Initialize entities for a level
  initializeEntities: (entityDefinitions) => {
    const positions = {};
    entityDefinitions.forEach(entityDef => {
      const id = generateEntityId(entityDef.type, entityDef.position.row, entityDef.position.col);
      positions[id] = {
        id,
        type: entityDef.type,
        position: { ...entityDef.position },
        metadata: entityDef.metadata || {},
      };
    });
    set({ entityPositions: positions, collectedEntities: new Set() });
  },

  // Update a single entity's position (for moving enemies)
  updateEntityPosition: (id, newPosition) => set((state) => ({
    entityPositions: {
      ...state.entityPositions,
      [id]: {
        ...state.entityPositions[id],
        position: newPosition,
      }
    }
  })),

  // Remove an entity
  removeEntity: (id) => set((state) => {
    const newPositions = { ...state.entityPositions };
    delete newPositions[id];
    return { entityPositions: newPositions };
  }),

  // Initial game state
  currentLevelId: 'demo1',
  score: 0,
  health: 100,
  collectedEntities: new Set(),

  // Actions
  setLevelId: (id) => set({ currentLevelId: id }),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  takeDamage: (damage) => set((state) => ({
    health: Math.max(0, state.health - damage)
  })),

  collectEntity: (id) => set((state) => ({
    collectedEntities: new Set(state.collectedEntities).add(id)
  })),

  resetCollectedEntities: () => set({ collectedEntities: new Set() }),

  // Transition to a new level
  transitionToLevel: (levelId) => {
    const targetLevel = levels[levelId];
    if (!targetLevel) {
      console.warn(`Level '${levelId}' not found`);
      return;
    }

    // Initialize entities for the new level
    const positions = {};
    targetLevel.entities.forEach(entityDef => {
      const id = generateEntityId(entityDef.type, entityDef.position.row, entityDef.position.col);
      positions[id] = {
        id,
        type: entityDef.type,
        position: { ...entityDef.position },
        metadata: entityDef.metadata || {},
      };
    });

    set({
      currentLevelId: levelId,
      playerGridPosition: targetLevel.spawnPoint,
      entityPositions: positions,
      collectedEntities: new Set(),
    });

    console.log(`Transitioned to ${targetLevel.name}`);
  },
}));
