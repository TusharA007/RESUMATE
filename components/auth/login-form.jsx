'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';

const inputClass = 'min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10';

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not create account.');
      }

      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false
      });
      if (result?.error) throw new Error('Login failed. Check your email and password.');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#030712] p-4 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.25),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(6,182,212,0.18),transparent_32%),linear-gradient(#030712,#07111f)]" />
      <section className="grid w-full max-w-5xl gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(79,70,229,0.5),rgba(6,182,212,0.16))] p-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <Image src="/logo.png" alt="RESUMETAI logo" width={56} height={56} className="h-14 w-14 object-contain" priority />
            </span>
            <span className="text-3xl font-black">RESUMETAI</span>
          </Link>
          <h1 className="mt-12 max-w-md text-4xl font-black leading-tight">Your AI voice interview and career intelligence workspace.</h1>
          <p className="mt-4 max-w-md text-slate-300">Save resume scans, interview feedback, readiness analytics, and learning progress with secure account storage.</p>
          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
            Create an account with email and password to open Resume Review, ATS Analysis, AI Interview, Skill Gap, Roadmap, and Analytics.
          </div>
        </div>

        <form className="p-2 md:p-6" onSubmit={submit}>
          <div className="flex gap-2 rounded-xl bg-white/[0.05] p-1">
            {['login', 'register'].map((item) => (
              <button className={`min-h-10 flex-1 rounded-lg font-bold ${mode === item ? 'bg-white text-[#07111f]' : 'text-slate-300'}`} type="button" onClick={() => setMode(item)} key={item}>
                {item === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <input className={`${inputClass} mt-5`} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />
          )}
          <input className={`${inputClass} mt-5`} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
          <input className={`${inputClass} mt-4`} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />

          {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-bold text-red-200">{error}</p>}

          <button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] font-black text-white disabled:opacity-60" disabled={loading}>
            <Lock size={18} />
            {loading ? 'Please wait...' : 'Continue'}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-white/10" />or continue with<span className="h-px flex-1 bg-white/10" /></div>

          <div className="grid gap-3">
            <button className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-bold text-slate-100" type="button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
              <Mail size={18} /> Google
            </button>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">For Vercel, add MongoDB Atlas and OAuth environment variables before deploying.</p>
        </form>
      </section>
    </main>
  );
}
