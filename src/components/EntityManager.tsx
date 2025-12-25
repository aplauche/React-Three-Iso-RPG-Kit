import { useMemo } from 'react';
import * as THREE from 'three';
import { EntityDefinition } from '../types/level';
import { EntityInstance } from '../types/entity';
import { gridToWorld } from '../utils/coordinateConversion';
import { GameObject } from '../utils/collision';
import {
  getEntityComponent,
  getEntitySize,
  isEntityCollidable,
  generateEntityId
} from '../entities';

interface EntityManagerProps {
  entities: EntityDefinition[];
  gridDimensions: { rows: number; cols: number };
  onCollect?: (entityId: string) => void;
  onDoorEnter?: (entityId: string, targetLevel?: string) => void;
  onEnemyHit?: (entityId: string) => void;
}

export default function EntityManager({
  entities,
  gridDimensions,
  onCollect,
  onDoorEnter,
  onEnemyHit
}: EntityManagerProps) {

  // Convert entity definitions to instances with 3D positions
  const entityInstances = useMemo(() => {
    const instances: EntityInstance[] = [];

    entities.forEach(entityDef => {
      const worldPosition = gridToWorld(entityDef.position, gridDimensions);
      const size = getEntitySize(entityDef.type);

      // Adjust Y position based on entity type height
      worldPosition.y = size.y / 2;

      const entityId = generateEntityId(
        entityDef.type,
        entityDef.position.row,
        entityDef.position.col
      );

      instances.push({
        id: entityId,
        type: entityDef.type,
        position: worldPosition,
        gridPosition: entityDef.position,
        size,
        isCollidable: isEntityCollidable(entityDef.type),
        metadata: entityDef.metadata,
      });
    });

    return instances;
  }, [entities, gridDimensions]);

  return (
    <>
      {entityInstances.map(entity => {
        const EntityComponent = getEntityComponent(entity.type);

        // Create collision callback based on entity type
        const handleCollide = () => {
          if (entity.type === 'collectible' && onCollect) {
            onCollect(entity.id);
          } else if (entity.type === 'door' && onDoorEnter) {
            const targetLevel = entity.metadata?.targetLevel;
            onDoorEnter(entity.id, targetLevel);
          } else if (entity.type === 'enemy' && onEnemyHit) {
            onEnemyHit(entity.id);
          }
        };

        return (
          <EntityComponent
            key={entity.id}
            position={entity.position}
            gridPosition={entity.gridPosition}
            metadata={entity.metadata}
            onCollide={handleCollide}
          />
        );
      })}
    </>
  );
}

/**
 * Helper hook to get collision objects from entities
 */
export function useEntityCollisionObjects(
  entities: EntityDefinition[],
  gridDimensions: { rows: number; cols: number }
): GameObject[] {
  return useMemo(() => {
    const objects: GameObject[] = [];

    entities.forEach(entityDef => {
      // Only include collidable entities
      if (!isEntityCollidable(entityDef.type)) return;

      const worldPosition = gridToWorld(entityDef.position, gridDimensions);
      const size = getEntitySize(entityDef.type);

      // Adjust Y position
      worldPosition.y = size.y / 2;

      objects.push({
        position: worldPosition,
        size,
      });
    });

    return objects;
  }, [entities, gridDimensions]);
}
