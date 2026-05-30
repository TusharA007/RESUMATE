'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, BrainCircuit, Check, ChevronRight, FileText, Mic, ShieldCheck, Upload, Zap } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

const resumeRadar = [
  { metric: 'ATS', score: 82 },
  { metric: 'Skills', score: 78 },
  { metric: 'Projects', score: 84 },
  { metric: 'Experience', score: 76 },
  { metric: 'Readability', score: 80 },
  { metric: 'Impact', score: 86 }
];

const missingSkills = [
  ['Role Keywords', 'High', 'RK'],
  ['Measurable Results', 'High', 'MR'],
  ['Tool Proficiency', 'Medium', 'TP'],
  ['Domain Knowledge', 'Medium', 'DK'],
  ['Communication Clarity', 'Low', 'CC']
];

export default function DashboardClient() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <div>
        <h1 className="text-3xl font-black text-white">Good evening 👋</h1>
        <p className="mt-1 text-slate-400">Let&apos;s make you job-ready and interview-ready.</p>
      </div>
      <HeroStats />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <ResumeAnalysisCard />
            <MissingSkillsCard />
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <RoadmapCard />
            <ActivityCard />
          </div>
          <BottomCta />
        </div>
        <RightRail />
      </div>
    </motion.div>
  );
}

function HeroStats() {
  return (
    <Card className="grid gap-5 p-6 md:grid-cols-4">
      {[
        ['ATS Score', '82', '/100', '#38bdf8'],
        ['Interview Readiness', '7.8', '/10', '#a855f7'],
        ['Skill Match', '78', '%', '#22d3ee'],
        ['Hiring Probability', 'High', 'Strong Chance', '#34d399']
      ].map(([title, value, suffix, color], index) => (
        <div className="flex items-center justify-between gap-4 border-white/10 md:border-r md:pr-5 last:border-r-0" key={title}>
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <div className="mt-3 flex items-end gap-1">
              <strong className="text-3xl font-black text-white">{value}</strong>
              <span className="mb-1 text-sm text-slate-400">{suffix}</span>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Good</p>
          </div>
          <Ring value={index === 3 ? 72 : Number(value) || 78} color={color} />
        </div>
      ))}
    </Card>
  );
}

function Ring({ value, color }) {
  return (
    <div className="relative grid h-20 w-20 place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${value * 3.6}deg, rgba(255,255,255,0.08) 0)` }}>
      <div className="absolute inset-2 rounded-full bg-[#07111f]" />
    </div>
  );
}

function ResumeAnalysisCard() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-black text-white">Resume Analysis</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.05fr_1fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={resumeRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#CBD5E1', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.42} />
              <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="hidden w-px bg-white/10 md:block" />
        <div className="grid content-center gap-5">
          <InsightGroup title="Strengths" color="emerald" items={['Clear role direction', 'Good experience depth', 'Relevant work history']} />
          <InsightGroup title="Improvements" color="orange" items={['Add more quantified achievements', 'Improve keyword density', 'Add tools and responsibilities section']} />
        </div>
      </div>
      <Link className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-bold text-white hover:bg-white/[0.06]" href="/resume-lab">View Full Analysis <ChevronRight size={16} /></Link>
    </Card>
  );
}

function InsightGroup({ title, items, color }) {
  return (
    <div>
      <h3 className="font-bold text-white">{title}</h3>
      <div className="mt-3 grid gap-3">
        {items.map((item) => (
          <p className="flex items-center gap-2 text-sm text-slate-300" key={item}>
            <span className={`grid h-4 w-4 place-items-center rounded-full ${color === 'emerald' ? 'bg-emerald-500/80' : 'bg-orange-500/80'}`}>{color === 'emerald' ? <Check size={11} /> : '!'}</span>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function MissingSkillsCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Top Missing Skills</h2>
        <Link className="rounded-lg bg-violet-500/20 px-3 py-2 text-xs font-bold text-violet-200" href="/skill-gap">View All</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {missingSkills.map(([skill, level, badge]) => (
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0" key={skill}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#0ea5e9,#7c3aed)] text-xs font-black text-white">{badge}</span>
            <strong className="flex-1 text-sm text-white">{skill}</strong>
            <span className={`rounded-lg px-3 py-1 text-xs font-bold ${level === 'High' ? 'bg-red-500/15 text-red-300' : level === 'Medium' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{level}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RoadmapCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-black text-white">Learning Roadmap</h2><p className="text-sm text-slate-400">Your personalized 3-week learning plan</p></div>
        <Link className="rounded-xl bg-violet-500/20 px-4 py-2 text-xs font-bold text-white" href="/roadmap">View Full Roadmap</Link>
      </div>
      <div className="mt-7 grid grid-cols-3 items-center gap-3">
        {['Week 1', 'Week 2', 'Week 3'].map((week, index) => (
          <div className="relative text-center" key={week}>
            <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full ${index === 0 ? 'bg-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.65)]' : 'bg-slate-700'}`}><span className="h-2 w-2 rounded-full bg-white" /></div>
            <p className={`mt-3 text-sm ${index === 0 ? 'text-violet-300' : 'text-slate-300'}`}>{week}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-black text-white">Recent Activity</h2>
      <div className="mt-5 grid gap-4">
        {['Resume analyzed', 'ATS score improved', 'Mock interview completed', 'New skills recommended', 'Roadmap updated'].map((text, index) => (
          <div className="flex items-center gap-3 text-sm" key={text}><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Zap size={14} /></span><span className="flex-1 text-slate-300">{text}</span><span className="text-slate-500">{index + 1}h ago</span></div>
        ))}
      </div>
    </Card>
  );
}

function RightRail() {
  return (
    <aside className="grid content-start gap-5">
      <Card className="p-6 text-center">
        <div className="flex items-center justify-between"><h2 className="font-black text-white">AI Interview</h2><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">● Live</span></div>
        <AIOrb />
        <h3 className="mt-4 text-lg font-black text-white">Ready for your interview?</h3>
        <p className="mt-2 text-sm text-slate-400">Real-time AI voice interview with adaptive questioning.</p>
        <Link className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#2f8cff,#8b31f4)] font-bold text-white" href="/interview"><Mic size={18} /> Start Interview</Link>
      </Card>
      <Card className="p-6">
        <h2 className="font-black text-white">Quick Actions</h2>
        <div className="mt-5 grid gap-3">
          {[
            ['Upload New Resume', 'Analyze a new resume', Upload, '/resume-lab'],
            ['Check ATS Score', 'Run ATS compatibility test', ShieldCheck, '/ats-analysis'],
            ['AI Resume Builder', 'Build a professional resume', FileText, '/resume-lab'],
            ['Practice Interview', 'Start a mock interview', Mic, '/interview']
          ].map(([title, sub, Icon, href]) => <Link className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]" href={href} key={title}><Icon className="text-slate-300" size={20} /><span><strong className="block text-sm text-white">{title}</strong><small className="text-slate-500">{sub}</small></span></Link>)}
        </div>
      </Card>
    </aside>
  );
}

function AIOrb() {
  return (
    <div className="relative mx-auto mt-8 grid h-44 w-44 place-items-center">
      <div className="absolute inset-0 rounded-full border border-blue-500/40" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,#38bdf8,transparent)]" />
      <motion.div className="grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle,#8b5cf6,#312e81_62%,#020617)] shadow-[0_0_60px_rgba(124,58,237,0.75)]" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: 3, duration: 2.5, repeatType: 'loop' }}>
        <BrainCircuit className="text-white" />
      </motion.div>
    </div>
  );
}

function BottomCta() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-[18px] border border-violet-500/50 bg-[linear-gradient(135deg,rgba(79,70,229,0.45),rgba(17,24,39,0.85),rgba(37,99,235,0.5))] p-6 sm:flex-row sm:items-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-500/30 text-3xl shadow-[0_0_42px_rgba(124,58,237,0.65)]">✦</div>
      <div className="flex-1"><h2 className="text-xl font-black text-white">Ready to become unstoppable?</h2><p className="mt-1 text-sm text-slate-300">Continue learning, practicing, and improving. You&apos;re one step closer to your target role.</p></div>
      <Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#7c3aed,#2563eb)] px-5 font-bold text-white" href="/interview">Start AI Interview <ChevronRight size={16} /></Link>
    </section>
  );
}
