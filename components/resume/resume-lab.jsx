'use client';

import { useState } from 'react';
import { BrainCircuit, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';

const input = 'min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10';

export default function ResumeLab({ mode = 'resume' }) {
  const [form, setForm] = useState({ targetRole: 'Target Role, e.g. HR Executive, CA, Marketing Manager', resumeText: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function analyze(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const payload = new FormData();
    payload.append('targetRole', form.targetRole);
    payload.append('resumeText', form.resumeText);
    if (file) payload.append('resume', file);

    try {
      const response = await fetch('/api/resume/analyze', { method: 'POST', body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-[22px] border border-white/10 bg-[#0b1426]/72 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl" onSubmit={analyze}>
        <h1 className="text-3xl font-black text-white">{mode === 'ats' ? 'ATS Analysis' : 'Resume Intelligence Lab'}</h1>
        <p className="mt-1 text-slate-400">Upload, paste, and receive ATS + recruiter-readiness insight.</p>
        <div className="mt-6 grid gap-4">
          <input className={input} value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} />
          <label className="grid min-h-28 cursor-pointer place-items-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-5 text-center font-bold text-cyan-100">
            <Upload />
            <span className="mt-2">{file ? file.name : 'Upload PDF resume or paste content below'}</span>
            <input className="hidden" type="file" accept=".pdf,.txt,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <textarea className={`${input} py-3`} rows="12" placeholder="Paste resume content..." value={form.resumeText} onChange={(e) => setForm({ ...form, resumeText: e.target.value })} />
        </div>
        {error && <p className="mt-3 rounded-xl bg-red-400/10 p-3 text-sm font-bold text-red-200">{error}</p>}
        <button className="mt-5 min-h-12 w-full rounded-xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] font-black text-white disabled:opacity-60" disabled={loading}>{loading ? 'Analyzing...' : 'Run Intelligence Scan'}</button>
      </form>

      <Card className="p-6">
        <h2 className="text-2xl font-black text-white">Analysis Output</h2>
        {result ? (
          <div className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Score label="ATS Score" value={`${result.atsScore}/100`} />
              <Score label="Readiness" value={`${result.readinessScore}/10`} />
            </div>
            <List title="Suggestions" items={result.suggestions} />
            <List title="Missing Skills" items={result.missingSkills} />
          </div>
        ) : (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <BrainCircuit className="mx-auto text-cyan-300" size={54} />
              <p className="mt-4 max-w-sm text-slate-400">Career intelligence report appears here after scanning your resume.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Score({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-sm text-slate-400">{label}</p><strong className="mt-2 block text-4xl font-black text-white">{value}</strong></div>;
}

function List({ title, items = [] }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><h3 className="font-black text-white">{title}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
