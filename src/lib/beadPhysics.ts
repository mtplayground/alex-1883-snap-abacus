import type { BeadState } from '../types/abacus';

export const TRACK_MIN = 0.07;
export const TRACK_MAX = 0.93;
export const DEFAULT_MIN_BEAD_GAP = 0.045;
export const SNAP_SLOT_COUNT = 20;
export const SNAP_SLOT_STEP = (TRACK_MAX - TRACK_MIN) / (SNAP_SLOT_COUNT - 1);

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function resolveDraggedBeads(
  beads: BeadState[],
  draggedIndex: number,
  targetPosition: number,
  minGap = DEFAULT_MIN_BEAD_GAP,
) {
  const maxGap = (TRACK_MAX - TRACK_MIN) / Math.max(beads.length - 1, 1);
  const gap = Math.min(minGap, maxGap);
  const positions = beads.map((bead) => bead.position);

  positions[draggedIndex] = clamp(targetPosition, TRACK_MIN, TRACK_MAX);

  for (let index = draggedIndex + 1; index < positions.length; index += 1) {
    positions[index] = Math.max(positions[index], positions[index - 1] + gap);
  }

  if (positions[positions.length - 1] > TRACK_MAX) {
    positions[positions.length - 1] = TRACK_MAX;

    for (let index = positions.length - 2; index >= 0; index -= 1) {
      positions[index] = Math.min(positions[index], positions[index + 1] - gap);
    }
  }

  for (let index = draggedIndex - 1; index >= 0; index -= 1) {
    positions[index] = Math.min(positions[index], positions[index + 1] - gap);
  }

  if (positions[0] < TRACK_MIN) {
    positions[0] = TRACK_MIN;

    for (let index = 1; index < positions.length; index += 1) {
      positions[index] = Math.max(positions[index], positions[index - 1] + gap);
    }
  }

  return beads.map((bead, index) => ({
    ...bead,
    isSettling: false,
    position: clamp(positions[index], TRACK_MIN, TRACK_MAX),
  }));
}

export function positionForSlot(slot: number) {
  return TRACK_MIN + clamp(slot, 0, SNAP_SLOT_COUNT - 1) * SNAP_SLOT_STEP;
}

export function nearestSlotForPosition(position: number) {
  return Math.round(
    (clamp(position, TRACK_MIN, TRACK_MAX) - TRACK_MIN) / SNAP_SLOT_STEP,
  );
}

export function snapBeadsToSlots(beads: BeadState[]) {
  const slots = beads.map((bead) => nearestSlotForPosition(bead.position));

  for (let index = 1; index < slots.length; index += 1) {
    slots[index] = Math.max(slots[index], slots[index - 1] + 1);
  }

  if (slots[slots.length - 1] > SNAP_SLOT_COUNT - 1) {
    slots[slots.length - 1] = SNAP_SLOT_COUNT - 1;

    for (let index = slots.length - 2; index >= 0; index -= 1) {
      slots[index] = Math.min(slots[index], slots[index + 1] - 1);
    }
  }

  return beads.map((bead, index) => {
    const slot = clamp(slots[index], 0, SNAP_SLOT_COUNT - 1);

    return {
      ...bead,
      isSettling: true,
      position: positionForSlot(slot),
      slot,
    };
  });
}
