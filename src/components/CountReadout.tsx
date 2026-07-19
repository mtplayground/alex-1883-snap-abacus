import type { AbacusCount } from '../lib/count';

type CountReadoutProps = {
  count: AbacusCount;
};

export function CountReadout({ count }: CountReadoutProps) {
  return (
    <aside
      aria-label="Live abacus count"
      aria-live="polite"
      className="count-readout flex items-center justify-center border-ink bg-pool text-ink"
    >
      <span className="count-label font-black uppercase tracking-normal">
        Count
      </span>
      <strong className="count-value text-center font-black leading-none">
        {count.total}
      </strong>
    </aside>
  );
}
