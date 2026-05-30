import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link className="flex items-center gap-3.5" href="/dashboard">
      <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
        <Image src="/logo.png" alt="RESUMETAI logo" width={50} height={50} className="h-12 w-12 object-contain" priority />
      </span>
      <span>
        <strong className="block text-2xl font-black tracking-wide text-white">RESUMETAI</strong>
        <small className="block text-xs text-slate-400">Career Intelligence OS</small>
      </span>
    </Link>
  );
}
