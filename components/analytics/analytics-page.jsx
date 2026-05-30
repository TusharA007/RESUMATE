'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';

const data = [
  { week: 'W1', score: 62 },
  { week: 'W2', score: 70 },
  { week: 'W3', score: 76 },
  { week: 'W4', score: 84 }
];

export default function AnalyticsPage() {
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-black text-white">Analytics</h1>
      <p className="mt-2 text-slate-400">Track interview growth, readiness, and weekly activity.</p>
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff' }} />
            <Bar dataKey="score" fill="#7C3AED" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
