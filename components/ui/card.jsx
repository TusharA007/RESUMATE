export const cardClass = 'rounded-[22px] border border-white/10 bg-[#0b1426]/72 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl';

export function Card({ children, className = '' }) {
  return <section className={`${cardClass} ${className}`}>{children}</section>;
}
