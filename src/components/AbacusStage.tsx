import { AbacusFrame } from './AbacusFrame';

type AbacusStageProps = {
  title: string;
};

export function AbacusStage({ title }: AbacusStageProps) {
  return (
    <section
      aria-label={`${title} abacus stage`}
      className="abacus-stage relative flex w-full max-w-6xl items-center justify-center border-ink bg-paper"
    >
      <div className="stage-accent stage-accent-top bg-punch" />
      <div className="stage-accent stage-accent-bottom bg-sun" />
      <div className="stage-accent stage-accent-left bg-pool" />
      <div className="stage-accent stage-accent-right bg-punch" />

      <AbacusFrame />
    </section>
  );
}
