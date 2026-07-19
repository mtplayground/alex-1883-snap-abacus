import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import {
  DEFAULT_MIN_BEAD_GAP,
  TRACK_MAX,
  TRACK_MIN,
  clamp,
  resolveDraggedBeads,
} from '../lib/beadPhysics';
import type { RodState } from '../types/abacus';
import { Rod } from './Rod';

const ROD_COUNT = 10;
const BEADS_PER_ROD = 10;

const rodPalette = [
  'bg-pool',
  'bg-sun',
  'bg-punch',
  'bg-[#8d5cff]',
  'bg-[#4ee26d]',
];

const beadPalette = [
  'bg-punch',
  'bg-sun',
  'bg-pool',
  'bg-[#8d5cff]',
  'bg-[#4ee26d]',
];

type DragInteraction = {
  beadIndex: number;
  minGap: number;
  pointerId: number;
  rodIndex: number;
  trackLeft: number;
  trackWidth: number;
};

function createInitialRods(): RodState[] {
  return Array.from({ length: ROD_COUNT }, (_, rodIndex) => ({
    beads: Array.from({ length: BEADS_PER_ROD }, (_, beadIndex) => ({
      beadIndex,
      id: `rod-${rodIndex}-bead-${beadIndex}`,
      position: TRACK_MIN + beadIndex * DEFAULT_MIN_BEAD_GAP,
      rodIndex,
    })),
    id: `rod-${rodIndex}`,
    rodIndex,
  }));
}

export function AbacusFrame() {
  const [rods, setRods] = useState(createInitialRods);
  const [activeBeadId, setActiveBeadId] = useState<string | null>(null);
  const dragRef = useRef<DragInteraction | null>(null);
  const latestTargetRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  function updateDraggedBeads() {
    animationFrameRef.current = null;

    const drag = dragRef.current;
    const targetPosition = latestTargetRef.current;

    if (!drag || targetPosition === null) {
      return;
    }

    setRods((currentRods) =>
      currentRods.map((rod) => {
        if (rod.rodIndex !== drag.rodIndex) {
          return rod;
        }

        return {
          ...rod,
          beads: resolveDraggedBeads(
            rod.beads,
            drag.beadIndex,
            targetPosition,
            drag.minGap,
          ),
        };
      }),
    );
  }

  function scheduleDragUpdate(targetPosition: number) {
    latestTargetRef.current = targetPosition;

    if (animationFrameRef.current === null) {
      animationFrameRef.current =
        window.requestAnimationFrame(updateDraggedBeads);
    }
  }

  function positionFromPointer(clientX: number, drag: DragInteraction) {
    return clamp(
      (clientX - drag.trackLeft) / drag.trackWidth,
      TRACK_MIN,
      TRACK_MAX,
    );
  }

  function handleBeadPointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    rodIndex: number,
    beadIndex: number,
  ) {
    const rodTrack = event.currentTarget.closest('[data-rod-track]');

    if (!(rodTrack instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();

    const trackRect = rodTrack.getBoundingClientRect();
    const beadRect = event.currentTarget.getBoundingClientRect();
    const measuredGap = (beadRect.width / Math.max(trackRect.width, 1)) * 0.92;

    dragRef.current = {
      beadIndex,
      minGap: Math.max(DEFAULT_MIN_BEAD_GAP, measuredGap),
      pointerId: event.pointerId,
      rodIndex,
      trackLeft: trackRect.left,
      trackWidth: Math.max(trackRect.width, 1),
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveBeadId(`rod-${rodIndex}-bead-${beadIndex}`);
    scheduleDragUpdate(positionFromPointer(event.clientX, dragRef.current));
  }

  function handleBeadPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    scheduleDragUpdate(positionFromPointer(event.clientX, drag));
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    latestTargetRef.current = null;
    setActiveBeadId(null);
  }

  return (
    <div
      aria-label="Abacus frame with 10 horizontal rods and 100 beads"
      className="relative mx-8 flex aspect-[5/3] w-[min(78vw,820px)] min-w-0 items-center justify-center"
    >
      <div className="absolute inset-0 rounded-[2rem] border-[12px] border-ink bg-[#fff4b8] shadow-[14px_14px_0_#171316]" />
      <div className="absolute inset-x-8 top-8 h-7 rounded-full border-4 border-ink bg-punch" />
      <div className="absolute inset-x-8 bottom-8 h-7 rounded-full border-4 border-ink bg-pool" />
      <div className="absolute inset-y-8 left-8 w-7 rounded-full border-4 border-ink bg-sun" />
      <div className="absolute inset-y-8 right-8 w-7 rounded-full border-4 border-ink bg-[#8d5cff]" />

      <div className="relative z-10 grid h-[72%] w-[82%] grid-rows-10 gap-3 sm:gap-4">
        {rods.map((rod, index) => (
          <Rod
            activeBeadId={activeBeadId}
            beadColorClassName={beadPalette[index % beadPalette.length]}
            beads={rod.beads}
            colorClassName={rodPalette[index % rodPalette.length]}
            key={rod.id}
            onBeadPointerCancel={endDrag}
            onBeadPointerDown={handleBeadPointerDown}
            onBeadPointerMove={handleBeadPointerMove}
            onBeadPointerUp={endDrag}
            rodIndex={rod.rodIndex}
          />
        ))}
      </div>
    </div>
  );
}
