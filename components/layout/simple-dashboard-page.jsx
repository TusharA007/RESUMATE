import { Card } from '@/components/ui/card';

export default function SimpleDashboardPage({ title, description }) {
  return (
    <Card className="p-6">
      <h1 className="text-3xl font-black text-white">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-400">{description}</p>
    </Card>
  );
}
