import type { PointerEvent as ReactPointerEvent } from 'react';

import type { BeadState } from '../types/abacus';

type BeadProps = {
  bead: BeadState;
  colorClassName: string;
  isActive: boolean;
  onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    rodIndex: number,
    beadIndex: number,
  ) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
};

export function Bead({
  bead,
  colorClassName,
  isActive,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BeadProps) {
  return (
    <button
      aria-label={`Rod ${bead.rodIndex + 1}, bead ${bead.beadIndex + 1}`}
      className={`absolute top-1/2 z-20 size-[clamp(0.82rem,2.45vw,1.55rem)] -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-[3px] border-ink ${colorClassName} shadow-[4px_4px_0_#171316] outline-none transition-[box-shadow,filter] duration-100 will-change-[left] focus-visible:ring-4 focus-visible:ring-white/90 active:cursor-grabbing sm:border-4 ${
        isActive
          ? 'cursor-grabbing brightness-110 shadow-[2px_2px_0_#171316]'
          : 'cursor-grab'
      }`}
      data-bead
      onPointerCancel={onPointerCancel}
      onPointerDown={(event) =>
        onPointerDown(event, bead.rodIndex, bead.beadIndex)
      }
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        left: `${bead.position * 100}%`,
      }}
      type="button"
    >
      <span className="pointer-events-none absolute left-[18%] top-[18%] block size-[22%] rounded-full bg-white/70" />
    </button>
  );
}
