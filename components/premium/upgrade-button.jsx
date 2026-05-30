'use client';

export default function UpgradeButton({ children = 'Upgrade Now', className = '' }) {
  return (
    <button className={className} onClick={() => alert('Premium features are coming soon. The interview flow is still available without upgrade.') }>
      {children}
    </button>
  );
}
