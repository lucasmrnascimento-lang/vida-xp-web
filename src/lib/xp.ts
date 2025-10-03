import type { LevelInfo } from "@/lib/types";

export const XP_RULES = {
  checkin_evento_feito: 10,
  checkin_evento_parcial: 5,
  checkin_habito_bom_feito: 8,
  habito_mau_evitar: 12,
  habito_mau_recaida: -15,
  meta_progresso_significativo: 15,
  meta_concluida: 100,
  streak_3_dias: 10,
  streak_7_dias: 30,
  streak_30_dias: 150,
} as const;

export function levelFromXp(totalXp: number): LevelInfo {
  const base = 250;
  const level = Math.floor(totalXp / base) + 1;
  const currentLevelBase = Math.floor((level - 1) * base);
  const nextLevelBase = level * base;
  const progressToNext = Math.max(0, Math.min(1, (totalXp - currentLevelBase) / (nextLevelBase - currentLevelBase)));
  return { totalXp, level, currentLevelBase, nextLevelBase, progressToNext };
}
