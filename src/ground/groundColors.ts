// Ground type to color mapping
export const GROUND_COLORS: Record<string, string> = {
  'g': '#90EE90',  // grass (light green)
  's': '#808080',  // stone (gray)
  'd': '#8B4513',  // dirt (brown)
  'p': '#DDA0DD',  // path (plum)
  'w': '#4169E1',  // water (blue)
};

// Default color for unknown ground types
export const DEFAULT_GROUND_COLOR = '#CCCCCC'; // light gray

// Tile collision configuration - define which tile types block movement
export const TILE_COLLIDABLE: Record<string, boolean> = {
  'g': false,  // grass - walkable
  's': false,  // stone - walkable
  'd': false,  // dirt - walkable
  'p': false,  // path - walkable
  'w': true,   // water - NOT walkable (blocks movement)
};

// Helper function to check if a tile type is collidable
export const isTileCollidable = (tileType: string): boolean => {
  return TILE_COLLIDABLE[tileType] ?? false; // Default to walkable if unknown
};
