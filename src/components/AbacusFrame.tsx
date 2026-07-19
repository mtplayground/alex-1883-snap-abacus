import { Rod } from './Rod';

const ROD_COUNT = 10;

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

export function AbacusFrame() {
  return (
    <div
      aria-label="Abacus frame with 10 horizontal rods and 100 beads"
      className="relative mx-8 flex aspect-[5/3] w-[min(78vw,820px)] min-w-0 items-center justify-center"
      role="img"
    >
      <div className="absolute inset-0 rounded-[2rem] border-[12px] border-ink bg-[#fff4b8] shadow-[14px_14px_0_#171316]" />
      <div className="absolute inset-x-8 top-8 h-7 rounded-full border-4 border-ink bg-punch" />
      <div className="absolute inset-x-8 bottom-8 h-7 rounded-full border-4 border-ink bg-pool" />
      <div className="absolute inset-y-8 left-8 w-7 rounded-full border-4 border-ink bg-sun" />
      <div className="absolute inset-y-8 right-8 w-7 rounded-full border-4 border-ink bg-[#8d5cff]" />

      <div className="relative z-10 grid h-[72%] w-[82%] grid-rows-10 gap-3 sm:gap-4">
        {Array.from({ length: ROD_COUNT }, (_, index) => (
          <Rod
            beadColorClassName={beadPalette[index % beadPalette.length]}
            colorClassName={rodPalette[index % rodPalette.length]}
            index={index}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
