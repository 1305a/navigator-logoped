export function parseRuDate(value: string): Date {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
