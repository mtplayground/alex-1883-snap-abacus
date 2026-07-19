import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import {
  DEFAULT_MIN_BEAD_GAP,
  TRACK_MAX,
  TRACK_MIN,
  clamp,
  positionForSlot,
  resolveDraggedBeads,
  snapBeadsToSlots,
} from '../lib/beadPhysics';
import { deriveAbacusCount } from '../lib/count';
import type { RodState } from '../types/abacus';
import { CountReadout } from './CountReadout';
import { Rod } from './Rod';

const ROD_COUNT = 10;
const BEADS_PER_ROD = 10;
const SETTLE_DURATION_MS = 560;

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
      isSettling: false,
      position: positionForSlot(beadIndex),
      rodIndex,
      slot: beadIndex,
    })),
    id: `rod-${rodIndex}`,
    rodIndex,
  }));
}

export function AbacusFrame() {
  const [rods, setRods] = useState(createInitialRods);
  const [activeBeadId, setActiveBeadId] = useState<string | null>(null);
  const count = deriveAbacusCount(rods);
  const dragRef = useRef<DragInteraction | null>(null);
  const latestTargetRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const settleTimeoutsRef = useRef<Record<number, number>>({});

  useEffect(() => {
    const settleTimeouts = settleTimeoutsRef.current;

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      Object.values(settleTimeouts).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

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

  function clearSettlingAfterAnimation(rodIndex: number) {
    const existingTimeout = settleTimeoutsRef.current[rodIndex];

    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
    }

    settleTimeoutsRef.current[rodIndex] = window.setTimeout(() => {
      setRods((currentRods) =>
        currentRods.map((rod) => {
          if (rod.rodIndex !== rodIndex) {
            return rod;
          }

          return {
            ...rod,
            beads: rod.beads.map((bead) => ({
              ...bead,
              isSettling: false,
            })),
          };
        }),
      );

      delete settleTimeoutsRef.current[rodIndex];
    }, SETTLE_DURATION_MS);
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

    event.preventDefault();

    const finalPosition = positionFromPointer(event.clientX, drag);

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setRods((currentRods) =>
      currentRods.map((rod) => {
        if (rod.rodIndex !== drag.rodIndex) {
          return rod;
        }

        return {
          ...rod,
          beads: snapBeadsToSlots(
            resolveDraggedBeads(
              rod.beads,
              drag.beadIndex,
              finalPosition,
              drag.minGap,
            ),
          ),
        };
      }),
    );

    dragRef.current = null;
    latestTargetRef.current = null;
    setActiveBeadId(null);
    clearSettlingAfterAnimation(drag.rodIndex);
  }

  return (
    <div className="abacus-layout flex w-full flex-col items-center justify-center">
      <div
        aria-label="Abacus frame with 10 horizontal rods and 100 beads"
        className="abacus-frame-shell relative flex min-w-0 items-center justify-center"
      >
        <div className="frame-panel absolute inset-0 border-ink bg-[#fff4b8]" />
        <div className="frame-rail frame-rail-top border-ink bg-punch" />
        <div className="frame-rail frame-rail-bottom border-ink bg-pool" />
        <div className="frame-rail frame-rail-left border-ink bg-sun" />
        <div className="frame-rail frame-rail-right border-ink bg-[#8d5cff]" />

        <div className="rod-grid relative z-10 grid grid-rows-10">
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
      <CountReadout count={count} />
    </div>
  );
}
