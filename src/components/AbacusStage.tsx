import { AbacusFrame } from './AbacusFrame';

type AbacusStageProps = {
  title: string;
};

export function AbacusStage({ title }: AbacusStageProps) {
  return (
    <section
      aria-label={`${title} abacus stage`}
      className="relative flex h-[min(72vh,660px)] min-h-[420px] w-full max-w-5xl items-center justify-center rounded-[2rem] border-[10px] border-ink bg-paper shadow-stage outline outline-4 outline-offset-[-22px] outline-pool"
    >
      <div className="absolute inset-x-8 top-8 h-5 rounded-full bg-punch" />
      <div className="absolute inset-x-8 bottom-8 h-5 rounded-full bg-sun" />
      <div className="absolute inset-y-10 left-8 w-5 rounded-full bg-pool" />
      <div className="absolute inset-y-10 right-8 w-5 rounded-full bg-punch" />

      <AbacusFrame />
    </section>
  );
}
