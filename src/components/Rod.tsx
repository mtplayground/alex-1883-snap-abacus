import { Bead } from './Bead';

const BEADS_PER_ROD = 10;

type RodProps = {
  beadColorClassName: string;
  colorClassName: string;
  index: number;
};

export function Rod({ beadColorClassName, colorClassName, index }: RodProps) {
  return (
    <div
      aria-label={`Rod ${index + 1} with ${BEADS_PER_ROD} beads grouped at the left end`}
      className="relative flex min-h-0 items-center overflow-visible"
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
      {Array.from({ length: BEADS_PER_ROD }, (_, beadIndex) => (
        <Bead
          colorClassName={beadColorClassName}
          index={beadIndex}
          key={beadIndex}
        />
      ))}
    </div>
  );
}
