import { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';
import { getEntityComponent, isEntityCollidable } from '../entities';

export default function EntityManager() {
  // Read entities from Zustand
  const entityPositions = useGameStore((state) => state.entityPositions);
  const collectedEntities = useGameStore((state) => state.collectedEntities);

  // Convert entity positions to renderable instances
  const entityInstances = useMemo(() => {
    return Object.values(entityPositions)
      .filter(entity => !collectedEntities.has(entity.id))
      .map(entity => ({
        id: entity.id,
        type: entity.type,
        // Direct grid to world: col → x, row → z
        position: new THREE.Vector3(entity.position.col, 0.5, entity.position.row),
        gridPosition: entity.position,
        isCollidable: isEntityCollidable(entity.type),
        metadata: entity.metadata,
      }));
  }, [entityPositions, collectedEntities]);

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
