export type BeadState = {
  beadIndex: number;
  id: string;
  position: number;
  rodIndex: number;
};

export type RodState = {
  beads: BeadState[];
  id: string;
  rodIndex: number;
};
