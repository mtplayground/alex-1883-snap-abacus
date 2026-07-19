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
      className="relative flex min-h-0 items-center overflow-visible"
      data-rod-track
    >
      <div className="h-5 w-full rounded-full border-[3px] border-ink bg-white shadow-[0_5px_0_#171316] sm:h-6 sm:border-4" />
      <div
        aria-hidden="true"
        className={`absolute left-4 right-4 h-2 rounded-full ${colorClassName} sm:h-3`}
      />
      <div
        aria-hidden="true"
        className="absolute left-0 size-7 rounded-full border-4 border-ink bg-paper sm:size-8"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 size-7 rounded-full border-4 border-ink bg-paper sm:size-8"
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
