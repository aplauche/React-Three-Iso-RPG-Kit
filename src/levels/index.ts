import { LevelDefinition } from '../types/level';
import { demo1 } from './demo1';
import { demo2 } from './demo2';

export const levels: Record<string, LevelDefinition> = {
  demo1,
  demo2,
};

export { demo1, demo2 };
