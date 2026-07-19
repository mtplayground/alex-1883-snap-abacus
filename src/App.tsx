import './index.css';

import { AbacusStage } from './components/AbacusStage';

declare const __APP_TITLE__: string;

const appTitle = __APP_TITLE__;

export function App() {
  return (
    <main className="min-h-svh overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_20%_18%,#ffd447_0_16%,transparent_17%),linear-gradient(135deg,#ff3d64_0%,#ff7a3d_44%,#2fd3d6_100%)] text-ink">
      <div className="flex min-h-svh items-center justify-center px-[clamp(0.75rem,3vw,2rem)] py-[clamp(0.75rem,4svh,2rem)]">
        <AbacusStage title={appTitle} />
      </div>
    </main>
  );
}
