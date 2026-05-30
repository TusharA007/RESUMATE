'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-white/[0.06] hover:text-white" onClick={() => signOut({ callbackUrl: '/login' })} title="Sign out">
      <LogOut size={15} />
    </button>
  );
}
