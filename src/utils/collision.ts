import * as THREE from 'three';

export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface GameObject {
  position: THREE.Vector3;
  size: THREE.Vector3;
}

/**
 * Creates an AABB (Axis-Aligned Bounding Box) from a game object
 */
export function createAABB(obj: GameObject): BoundingBox {
  const halfSize = obj.size.clone().multiplyScalar(0.5);
  return {
    min: obj.position.clone().sub(halfSize),
    max: obj.position.clone().add(halfSize),
  };
}

/**
 * Checks if two AABBs are intersecting
 */
export function checkAABBCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y &&
    a.min.z <= b.max.z &&
    a.max.z >= b.min.z
  );
}

/**
 * Checks if a game object collides with any obstacles
 */
export function checkCollisionWithObstacles(
  player: GameObject,
  obstacles: GameObject[]
): boolean {
  const playerBox = createAABB(player);

  for (const obstacle of obstacles) {
    const obstacleBox = createAABB(obstacle);
    if (checkAABBCollision(playerBox, obstacleBox)) {
      return true;
    }
  }

  return false;
}

/**
 * Check collision with tiles and trigger callbacks
 * Returns true if collision blocks movement
 */
export function checkCollisionWithTiles(
  player: GameObject,
  tiles: any[] // TileInstance[] - using any to avoid circular dependency
): { blocked: boolean; collidedTiles: any[] } {
  const playerBox = createAABB(player);
  const collidedTiles: any[] = [];
  let blocked = false;

  for (const tile of tiles) {
    const tileBox = createAABB({ position: tile.position, size: tile.size });

    if (checkAABBCollision(playerBox, tileBox)) {
      collidedTiles.push(tile);

      // Trigger collision callback
      if (tile.onCollide) {
        const context = {
          player: {
            position: player.position.clone(),
            size: player.size.clone(),
          },
          tile,
          gridPosition: tile.gridPosition,
        };
        tile.onCollide(context);
      }

      // Check if this tile blocks movement
      if (tile.isCollidable) {
        blocked = true;
      }
    }
  }

  return { blocked, collidedTiles };
}
