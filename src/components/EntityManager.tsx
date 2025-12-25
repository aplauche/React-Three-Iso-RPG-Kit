import { useMemo } from 'react';
import { EntityDefinition } from '../types/level';
import { EntityInstance } from '../types/entity';
import { gridToWorld } from '../utils/coordinateConversion';
import {
  getEntityComponent,
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
        size: { x: 1, y: 1, z: 1 }, // All entities are 1x1 grid cells
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
            gridPosition={entity.gridPosition}
            metadata={entity.metadata}
          />
        );
      })}
    </>
  );
}

/**
 * Helper hook to get collidable grid positions
 * Returns a Set of "row,col" strings for collision checking
 */
export function useCollidablePositions(
  entities: EntityDefinition[]
): Set<string> {
  return useMemo(() => {
    const positions = new Set<string>();

    entities.forEach(entityDef => {
      if (isEntityCollidable(entityDef.type)) {
        const posKey = `${entityDef.position.row},${entityDef.position.col}`;
        positions.add(posKey);
      }
    });

    return positions;
  }, [entities]);
}
