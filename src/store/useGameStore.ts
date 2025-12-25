import { create } from 'zustand';
import { GridPosition } from '../types/tile';
import { levels } from '../levels';

interface GameState {
  // Player state (grid-based)
  playerGridPosition: GridPosition;
  setPlayerGridPosition: (position: GridPosition) => void;

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
  // Initial player state (grid position)
  playerGridPosition: { row: 1, col: 1 }, // demo1 spawn point
  setPlayerGridPosition: (position) => set({ playerGridPosition: position }),

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

  // Transition to a new level
  transitionToLevel: (levelId: string) => {
    const targetLevel = levels[levelId];
    if (!targetLevel) {
      console.warn(`Level '${levelId}' not found`);
      return;
    }

    set({
      currentLevelId: levelId,
      playerGridPosition: targetLevel.spawnPoint, // Directly use grid position
      collectedEntities: new Set(), // Reset collected items for new level
    });

    console.log(`Transitioned to ${targetLevel.name}`);
  },
}));
