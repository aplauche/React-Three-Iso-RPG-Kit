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
}

export default function EntityManager({
  entities,
  gridDimensions
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

        return (
          <EntityComponent
            key={entity.id}
            id={entity.id}
            position={entity.position}
            size={entity.size}
            gridPosition={entity.gridPosition}
            metadata={entity.metadata}
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
