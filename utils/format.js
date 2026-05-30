export function averageScore(scores = {}) {
  const values = Object.values(scores).map(Number).filter(Boolean);
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
