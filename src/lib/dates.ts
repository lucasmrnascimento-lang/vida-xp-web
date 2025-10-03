const DEFAULT_TZ = "America/Sao_Paulo";

export function getNow(_tz: string = DEFAULT_TZ): Date {
  return new Date();
}

export function toISO(date: Date): string {
  return date.toISOString();
}

export function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
