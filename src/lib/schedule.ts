export function generateTimeOptions(stepMinutes = 15, startHour = 8, endHour = 20): string[] {
  const options: string[] = [];
  for (let m = startHour * 60; m <= endHour * 60; m += stepMinutes) {
    const h = Math.floor(m / 60)
      .toString()
      .padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    options.push(`${h}:${mm}`);
  }
  return options;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
}
