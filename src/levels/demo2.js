export const demo2 = {
  id: 'demo2',
  name: 'Stone Arena',
  groundGrid: [
    ['w', 'w', 'w', 'w', 'w', 'w', 'w'],
    ['w', 's', 's', 's', 's', 's', 'w'],
    ['w', 's', 'd', 'd', 'd', 's', 'w'],
    ['w', 's', 'd', 'p', 'd', 's', 'w'],
    ['w', 's', 'd', 'd', 'd', 's', 'w'],
    ['w', 's', 's', 's', 's', 's', 'w'],
    ['w', 'w', 'w', 'w', 'w', 'w', 'w'],
  ],
  entities: [
    {
      type: 'enemy',
      position: { row: 2, col: 2 },
      metadata: { damage: 1 }
    },
    {
      type: 'enemy',
      position: { row: 2, col: 4 },
      metadata: { damage: 1 }
    },
    {
      type: 'enemy',
      position: { row: 4, col: 2 },
      metadata: { damage: 1 }
    },
    {
      type: 'collectible',
      position: { row: 3, col: 3 },
      metadata: { points: 50 }
    },
    {
      type: 'door',
      position: { row: 1, col: 3 },
      metadata: { targetLevel: 'demo1' }
    },
  ],
  spawnPoint: { row: 5, col: 3 },
};

// Legend:
// Ground types:
// w = water (blue)
// s = stone (gray)
// d = dirt (brown)
// p = path (plum)
