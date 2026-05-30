import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link className="flex items-center gap-3" href="/dashboard">
      <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
        <Image src="/logo.png" alt="RESUMETAI logo" width={42} height={42} className="h-10 w-10 object-contain" priority />
      </span>
      <span>
        <strong className="block text-xl font-black tracking-wide text-white">RESUMETAI</strong>
        <small className="block text-xs text-slate-400">Career Intelligence OS</small>
      </span>
    </Link>
  );
}
