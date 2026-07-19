import './index.css';

declare const __APP_TITLE__: string;

const appTitle = __APP_TITLE__;

export function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_18%,#ffd447_0_16%,transparent_17%),linear-gradient(135deg,#ff3d64_0%,#ff7a3d_44%,#2fd3d6_100%)] text-ink">
      <div className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <section
          aria-label={`${appTitle} abacus placeholder stage`}
          className="relative flex h-[min(68vh,620px)] w-full max-w-5xl items-center justify-center rounded-[2rem] border-[10px] border-ink bg-paper shadow-stage outline outline-4 outline-offset-[-22px] outline-pool"
        >
          <div className="absolute inset-x-8 top-8 h-5 rounded-full bg-punch" />
          <div className="absolute inset-x-8 bottom-8 h-5 rounded-full bg-sun" />
          <div className="absolute inset-y-10 left-8 w-5 rounded-full bg-pool" />
          <div className="absolute inset-y-10 right-8 w-5 rounded-full bg-punch" />

          <div className="mx-8 flex min-h-44 w-[min(78vw,760px)] items-center justify-center rounded-3xl border-4 border-dashed border-ink bg-white/70 px-6 text-center">
            <p className="max-w-lg text-balance text-2xl font-black uppercase tracking-normal sm:text-4xl">
              Abacus stage placeholder
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
