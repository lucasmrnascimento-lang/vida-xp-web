export type UUID = string;

// Users
export interface UserDoc {
  id: UUID; // mirrors auth uid
  name: string | null;
  email: string | null;
  timezone: string; // IANA, default "America/Sao_Paulo"
  created_at: string; // ISO datetime
}

// Events (agenda)
export type EventStatus = "planejado" | "feito" | "faltou";

export interface EventDoc {
  id: UUID;
  user_id: UUID;
  title: string;
  description?: string;
  start_datetime: string; // ISO datetime
  end_datetime: string; // ISO datetime
  all_day?: boolean;
  tags?: string[];
  status: EventStatus;
  goal_id?: UUID | null;
  habit_id?: UUID | null;
  created_at: string;
  updated_at: string;
}

// Goals
export type GoalType = "livro" | "curso" | "personalizada";
export type GoalStatus = "em_andamento" | "concluída" | "pausada" | "cancelada";

export interface GoalDoc {
  id: UUID;
  user_id: UUID;
  type: GoalType;
  title: string;
  metric_label: string; // ex.: páginas, aulas, minutos
  target_value: number;
  current_value: number;
  start_date: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  status: GoalStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Habits
export type HabitType = "bom" | "mau";
export type HabitSchedule = "diário" | "dias_da_semana" | "custom";

export interface HabitDoc {
  id: UUID;
  user_id: UUID;
  name: string;
  type: HabitType;
  schedule: HabitSchedule;
  days_of_week?: string[]; // ["seg", "qua", ...]
  target_per_day: number; // default 1
  unit_label: string; // ex.: min, vezes
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Checkins
export type CheckinSource = "event" | "goal" | "habit";
export type CheckinOutcome = "feito" | "parcial" | "não_feito";

export interface CheckinDoc {
  id: UUID;
  user_id: UUID;
  date: string; // YYYY-MM-DD (local user tz)
  source: CheckinSource;
  source_id: UUID;
  outcome: CheckinOutcome;
  quantity?: number; // páginas lidas, aulas, minutos
  notes?: string;
  created_at: string; // ISO datetime
}

// XP Transactions
export interface XpTransactionDoc {
  id: UUID;
  user_id: UUID;
  date: string; // ISO datetime
  reason:
    | "checkin_evento_feito"
    | "checkin_evento_parcial"
    | "checkin_habito_bom_feito"
    | "habito_mau_evitar"
    | "habito_mau_recaida"
    | "meta_progresso_significativo"
    | "meta_concluida"
    | "streak_3_dias"
    | "streak_7_dias"
    | "streak_30_dias";
  xp_delta: number; // can be negative
  metadata?: Record<string, unknown>;
  created_at: string; // ISO datetime
}

// Streaks
export type StreakScope = "global" | "habit" | "goal";

export interface StreakDoc {
  id: UUID;
  user_id: UUID;
  scope: StreakScope;
  scope_id?: UUID | null; // when scope != global
  current_streak: number; // in days
  longest_streak: number; // in days
  last_check_date: string; // YYYY-MM-DD (user tz)
}

// Presets
export type PresetKind = "goal" | "habit";

export interface PresetDoc {
  id: UUID;
  kind: PresetKind;
  title: string;
  description?: string;
  metric_label?: string;
  target_value?: number;
  unit_label?: string;
  example_tags?: string[];
}

// Derived helpers
export interface LevelInfo {
  totalXp: number;
  level: number;
  currentLevelBase: number; // xp at level start
  nextLevelBase: number; // xp required for next level base
  progressToNext: number; // 0-1
}
