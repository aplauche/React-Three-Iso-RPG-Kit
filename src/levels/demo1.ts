import { LevelDefinition } from '../types/level';

export const demo1: LevelDefinition = {
  id: 'demo1',
  name: 'Garden Path',
  groundGrid: [
    ['s', 's', 's', 's', 's', 's', 's'],
    ['s', 'g', 'g', 'g', 'g', 'g', 's'],
    ['s', 'g', 'p', 'p', 'p', 'g', 's'],
    ['s', 'g', 'p', 'd', 'p', 'g', 's'],
    ['s', 'g', 'p', 'p', 'p', 'g', 's'],
    ['s', 'g', 'g', 'g', 'g', 'g', 's'],
    ['s', 's', 's', 's', 's', 's', 's'],
  ],
  entities: [
    {
      type: 'collectible',
      position: { row: 1, col: 2 },
      metadata: { points: 10 }
    },
    {
      type: 'collectible',
      position: { row: 1, col: 4 },
      metadata: { points: 10 }
    },
    {
      type: 'enemy',
      position: { row: 3, col: 2 },
      metadata: { damage: 1 }
    },
    {
      type: 'collectible',
      position: { row: 5, col: 3 },
      metadata: { points: 15 }
    },
    {
      type: 'door',
      position: { row: 5, col: 5 },
      metadata: { targetLevel: 'demo2' }
    },
  ],
  spawnPoint: { row: 1, col: 1 },
};

// Legend:
// Ground types:
// s = stone (gray)
// g = grass (green)
// p = path (plum)
// d = dirt (brown)
