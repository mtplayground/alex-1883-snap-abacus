import { TRACK_MAX, TRACK_MIN } from './beadPhysics';
import type { RodState } from '../types/abacus';

const COUNT_THRESHOLD = TRACK_MIN + (TRACK_MAX - TRACK_MIN) / 2;

export type AbacusCount = {
  perRod: number[];
  total: number;
};

export function deriveAbacusCount(rods: RodState[]): AbacusCount {
  const perRod = rods.map((rod) =>
    rod.beads.reduce((count, bead) => {
      return bead.position >= COUNT_THRESHOLD ? count + 1 : count;
    }, 0),
  );

  return {
    perRod,
    total: perRod.reduce((sum, count) => sum + count, 0),
  };
}
