import type { AbacusCount } from '../lib/count';

type CountReadoutProps = {
  count: AbacusCount;
};

export function CountReadout({ count }: CountReadoutProps) {
  return (
    <aside
      aria-label="Live abacus count"
      aria-live="polite"
      className="flex min-w-[12rem] items-center justify-center gap-4 rounded-3xl border-[6px] border-ink bg-pool px-6 py-3 text-ink shadow-[8px_8px_0_#171316]"
    >
      <span className="text-sm font-black uppercase tracking-normal sm:text-base">
        Count
      </span>
      <strong className="min-w-20 text-center text-5xl font-black leading-none sm:text-6xl">
        {count.total}
      </strong>
    </aside>
  );
}
