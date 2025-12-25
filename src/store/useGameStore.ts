import { create } from 'zustand';
import * as THREE from 'three';
import { levels } from '../levels';
import { gridToWorld } from '../utils/coordinateConversion';

interface GameState {
  // Player state
  playerPosition: THREE.Vector3;
  playerSize: THREE.Vector3;
  setPlayerPosition: (position: THREE.Vector3) => void;

  // Game state
  currentLevelId: string;
  score: number;
  collectedEntities: Set<string>;

  // Actions
  setLevelId: (id: string) => void;
  addScore: (points: number) => void;
  collectEntity: (id: string) => void;
  resetCollectedEntities: () => void;
  transitionToLevel: (levelId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial player state
  playerPosition: new THREE.Vector3(0, 0.5, 0),
  playerSize: new THREE.Vector3(1, 1, 1),
  setPlayerPosition: (position) => set({ playerPosition: position }),

  // Initial game state
  currentLevelId: 'demo1',
  score: 0,
  collectedEntities: new Set(),

  // Actions
  setLevelId: (id) => set({ currentLevelId: id }),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  collectEntity: (id) => set((state) => ({
    collectedEntities: new Set(state.collectedEntities).add(id)
  })),

  resetCollectedEntities: () => set({ collectedEntities: new Set() }),

  // Complex action: transition to a new level
  transitionToLevel: (levelId: string) => {
    const targetLevel = levels[levelId];
    if (!targetLevel) {
      console.warn(`Level '${levelId}' not found`);
      return;
    }

    const gridDimensions = {
      rows: targetLevel.groundGrid.length,
      cols: targetLevel.groundGrid[0]?.length || 0,
    };

    // Calculate new player spawn position
    const newPosition = gridToWorld(targetLevel.spawnPoint, gridDimensions);
    newPosition.y = 0.5; // Player height

    set({
      currentLevelId: levelId,
      playerPosition: newPosition,
      collectedEntities: new Set(), // Reset collected items for new level
    });

    console.log(`Transitioned to ${targetLevel.name}`);
  },
}));
