import './index.css';

import { AbacusStage } from './components/AbacusStage';

declare const __APP_TITLE__: string;

const appTitle = __APP_TITLE__;

export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_18%,#ffd447_0_16%,transparent_17%),linear-gradient(135deg,#ff3d64_0%,#ff7a3d_44%,#2fd3d6_100%)] text-ink">
      <div className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <AbacusStage title={appTitle} />
      </div>
    </main>
  );
}
