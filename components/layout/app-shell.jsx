import Link from 'next/link';
import { Bell, BookOpenCheck, CalendarDays, FileText, Gauge, Home, LineChart, Mic, Search, Settings, ShieldCheck, UserCircle } from 'lucide-react';
import Logo from '@/components/ui/logo';
import SignOutButton from '@/components/auth/sign-out-button';
import ActiveNavLink from './active-nav-link';
import UpgradeButton from '@/components/premium/upgrade-button';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/resume-lab', label: 'Resume Review', icon: FileText },
  { href: '/ats-analysis', label: 'ATS Analysis', icon: Gauge },
  { href: '/skill-gap', label: 'Skill Gap', icon: LineChart },
  { href: '/interview', label: 'AI Interview', icon: Mic },
  { href: '/roadmap', label: 'Learning Roadmap', icon: ShieldCheck },
  { href: '/history', label: 'Interview History', icon: BookOpenCheck },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export default function AppShell({ children, user }) {
  const displayName = user?.name || user?.email?.split('@')[0] || 'Candidate';

  return (
    <main className="min-h-screen bg-[#030712] p-4 text-slate-100">
      <Background />
      <div className="mx-auto flex max-w-[1540px] gap-10">
        <aside className="hidden min-h-[calc(100vh-32px)] w-[260px] shrink-0 rounded-[22px] border border-white/10 bg-[#08111f]/90 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:sticky lg:top-4 lg:block">
          <div className="p-3"><Logo /></div>
          <nav className="mt-7 grid gap-2">
            {sidebarItems.map(({ href, label, icon: Icon }) => (
              <ActiveNavLink href={href} key={`${href}-${label}`}>
                <Icon size={18} />
                {label}
              </ActiveNavLink>
            ))}
          </nav>
          <UpgradeCard />
          <div className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#f8fafc,#64748b)] text-[#07111f]">
              <UserCircle />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{displayName}</p>
              <p className="truncate text-xs text-slate-400">{user?.email || 'profile ready'}</p>
            </div>
            <SignOutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4">
            <div className="lg:hidden"><Logo /></div>
            <div className="mx-auto hidden w-full max-w-[360px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-400 md:flex">
              <Search size={18} />
              <span className="text-sm">Search anything...</span>
              <kbd className="ml-auto rounded-lg bg-white/[0.06] px-2 py-1 text-xs">⌘ K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/[0.06]"><Bell size={20} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500" /></button>
              <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/[0.06]"><CalendarDays size={20} /></button>
              <Link className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#38bdf8,#7c3aed)] text-white" href="/settings"><UserCircle /></Link>
            </div>
          </header>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </main>
  );
}

function UpgradeCard() {
  return (
    <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-amber-300/15 text-amber-300">♕</div>
      <h3 className="mt-4 font-black text-white">Upgrade to Pro</h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">Unlock advanced AI insights, mock interviews, and personalized roadmap.</p>
      <UpgradeButton className="mt-5 min-h-11 w-full rounded-xl bg-[linear-gradient(135deg,#7c3aed,#2563eb)] font-bold text-white" />
    </div>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#030712]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.24),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(6,182,212,0.16),transparent_30%),linear-gradient(#030712,#07111f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
    </div>
  );
}
