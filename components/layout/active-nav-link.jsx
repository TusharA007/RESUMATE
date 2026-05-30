'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ActiveNavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition ${isActive ? 'bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-[0_0_28px_rgba(124,58,237,0.35)]' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'}`} href={href} prefetch={false}>
      {children}
    </Link>
  );
}
