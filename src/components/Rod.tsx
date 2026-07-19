import type { PointerEvent as ReactPointerEvent } from 'react';

import type { BeadState } from '../types/abacus';
import { Bead } from './Bead';

type RodProps = {
  activeBeadId: string | null;
  beadColorClassName: string;
  beads: BeadState[];
  colorClassName: string;
  onBeadPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onBeadPointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    rodIndex: number,
    beadIndex: number,
  ) => void;
  onBeadPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onBeadPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  rodIndex: number;
};

export function Rod({
  activeBeadId,
  beadColorClassName,
  beads,
  colorClassName,
  onBeadPointerCancel,
  onBeadPointerDown,
  onBeadPointerMove,
  onBeadPointerUp,
  rodIndex,
}: RodProps) {
  return (
    <div
      aria-label={`Rod ${rodIndex + 1} with ${beads.length} draggable beads`}
      className="relative flex min-h-0 touch-none select-none items-center overflow-visible"
      data-rod-track
      data-testid={`rod-${rodIndex}`}
    >
      <div className="rod-base w-full border-ink bg-white" />
      <div
        aria-hidden="true"
        className={`rod-core absolute ${colorClassName}`}
      />
      <div
        aria-hidden="true"
        className="rod-cap absolute left-0 border-ink bg-paper"
      />
      <div
        aria-hidden="true"
        className="rod-cap absolute right-0 border-ink bg-paper"
      />
      {beads.map((bead) => (
        <Bead
          bead={bead}
          colorClassName={beadColorClassName}
          isActive={bead.id === activeBeadId}
          key={bead.id}
          onPointerCancel={onBeadPointerCancel}
          onPointerDown={onBeadPointerDown}
          onPointerMove={onBeadPointerMove}
          onPointerUp={onBeadPointerUp}
        />
      ))}
    </div>
  );
}
