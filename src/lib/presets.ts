import type { PresetDoc } from "@/lib/types";

export const GOAL_PRESETS: PresetDoc[] = [
  { id: "preset_goal_livro", kind: "goal", title: "Livro", description: "Ler um livro", metric_label: "páginas", target_value: 300 },
  { id: "preset_goal_curso", kind: "goal", title: "Curso", description: "Assistir um curso", metric_label: "aulas", target_value: 15 },
  { id: "preset_goal_treino", kind: "goal", title: "Treino", description: "Minutos acumulados de treino (mensal)", metric_label: "minutos", target_value: 900 },
];

export const HABIT_PRESETS: PresetDoc[] = [
  { id: "preset_habit_ler", kind: "habit", title: "Ler 30 min", unit_label: "min", target_value: 30 },
  { id: "preset_habit_treinar", kind: "habit", title: "Treinar", unit_label: "vez(es)", target_value: 1 },
  { id: "preset_habit_meditar", kind: "habit", title: "Meditar 10 min", unit_label: "min", target_value: 10 },
  { id: "preset_habit_evitar_porn", kind: "habit", title: "Evitar pornografia", unit_label: "dia sem", target_value: 1 },
  { id: "preset_habit_tempo_tela", kind: "habit", title: "Reduzir tempo de tela", unit_label: "min máx.", target_value: 120 },
];
