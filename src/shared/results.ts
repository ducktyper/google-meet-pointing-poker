export interface Summary {
  average: number | null;
  distribution: Record<string, number>;
  consensus: boolean;
}

export function summarize(votes: Record<string, string>): Summary {
  const values = Object.values(votes);

  const distribution: Record<string, number> = {};
  for (const v of values) {
    distribution[v] = (distribution[v] ?? 0) + 1;
  }

  const numeric = values.map(Number).filter((n, i) => !isNaN(n) && values[i] !== "?" && values[i] !== "∞");
  const average = numeric.length > 0
    ? numeric.reduce((a, b) => a + b, 0) / numeric.length
    : null;

  const consensus = values.length > 1 && new Set(values).size === 1;

  return { average, distribution, consensus };
}
