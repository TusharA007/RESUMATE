import { Card } from '@/components/ui/card';

const skills = [
  ['Role-specific keywords', 'High', 92],
  ['Measurable achievements', 'High', 88],
  ['Domain tools', 'Medium', 78],
  ['Decision explanation', 'Medium', 74],
  ['Communication Clarity', 'High', 86]
];

export default function SkillGapPage() {
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-black text-white">Skill Gap Detector</h1>
      <p className="mt-2 text-slate-400">Prioritized learning areas based on role demand and resume readiness.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {skills.map(([name, priority, demand]) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5" key={name}>
            <h2 className="font-black text-white">{name}</h2>
            <p className="mt-2 text-sm text-slate-400">Priority: {priority}</p>
            <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${demand}%` }} /></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
