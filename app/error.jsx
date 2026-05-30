'use client';

export default function Error({ error, reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#030712] p-6 text-white">
      <section className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-black">Something went wrong</h1>
        <p className="mt-3 text-slate-400">{error?.message || 'Please try again.'}</p>
        <button className="mt-6 rounded-2xl bg-cyan-400 px-5 py-3 font-black text-[#06111f]" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
