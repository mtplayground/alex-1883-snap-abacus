export type BeadState = {
  beadIndex: number;
  id: string;
  isSettling: boolean;
  position: number;
  rodIndex: number;
  slot: number;
};

export type RodState = {
  beads: BeadState[];
  id: string;
  rodIndex: number;
};
