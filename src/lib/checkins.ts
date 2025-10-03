import { db } from "@/lib/firebase";
import type { CheckinDoc, CheckinOutcome, CheckinSource, GoalDoc, UUID, XpTransactionDoc } from "@/lib/types";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { XP_RULES } from "@/lib/xp";
import { upsertStreak } from "@/lib/streaks";

const CHECKINS = "checkins";
const GOALS = "goals";
const XP = "xp_transactions";

// Debounce: avoid duplicate checkins in 30s window for same source
export async function canCreateCheckin(userId: UUID, source: CheckinSource, sourceId: UUID): Promise<boolean> {
  const thirtySecondsAgo = new Date(Date.now() - 30_000).toISOString();
  const q = query(
    collection(db, CHECKINS),
    where("user_id", "==", userId),
    where("source", "==", source),
    where("source_id", "==", sourceId),
    where("created_at", ">=", thirtySecondsAgo),
    orderBy("created_at", "desc")
  );
  const snap = await getDocs(q);
  return snap.size === 0;
}

export async function createCheckin(params: {
  userId: UUID;
  ymd: string; // YYYY-MM-DD
  source: CheckinSource;
  sourceId: UUID;
  outcome: CheckinOutcome;
  quantity?: number;
  notes?: string;
}) {
  const { userId, ymd, source, sourceId, outcome, quantity, notes } = params;
  if (quantity !== undefined && quantity < 0) throw new Error("quantity deve ser >= 0");

  const nowIso = new Date().toISOString();
  const checkin: Omit<CheckinDoc, "id"> = {
    user_id: userId,
    date: ymd,
    source,
    source_id: sourceId,
    outcome,
    quantity,
    notes,
    created_at: nowIso,
  };
  const created = await addDoc(collection(db, CHECKINS), checkin);

  // Side effects
  if (source === "goal" && quantity && quantity > 0) {
    const goalRef = doc(collection(db, GOALS), sourceId);
    const goalSnap = await getDoc(goalRef);
    if (goalSnap.exists()) {
      const goal = goalSnap.data() as GoalDoc;
      const newValue = (goal.current_value ?? 0) + quantity;
      const updates: Partial<GoalDoc> = { current_value: newValue, updated_at: nowIso };
      if (goal.target_value && newValue >= goal.target_value && goal.status !== "concluída") {
        updates.status = "concluída";
        await addXp(userId, "meta_concluida", XP_RULES.meta_concluida, { goalId: sourceId });
      }
      await setDoc(goalRef, updates, { merge: true });
    }
  }

  await awardXpForCheckin({ userId, source, outcome });
  await updateStreaks({ userId, source, sourceId, outcome, ymd });

  return created.id;
}

async function addXp(userId: UUID, reason: XpTransactionDoc["reason"], xp: number, metadata?: Record<string, unknown>) {
  const tx: Omit<XpTransactionDoc, "id"> = {
    user_id: userId,
    date: new Date().toISOString(),
    reason,
    xp_delta: xp,
    metadata,
    created_at: new Date().toISOString(),
  };
  await addDoc(collection(db, XP), tx);
}

async function awardXpForCheckin(args: { userId: UUID; source: CheckinSource; outcome: CheckinOutcome }) {
  const { userId, source, outcome } = args;
  if (source === "event") {
    if (outcome === "feito") return addXp(userId, "checkin_evento_feito", XP_RULES.checkin_evento_feito);
    if (outcome === "parcial") return addXp(userId, "checkin_evento_parcial", XP_RULES.checkin_evento_parcial);
  }
  if (source === "habit") {
    if (outcome === "feito") return addXp(userId, "checkin_habito_bom_feito", XP_RULES.checkin_habito_bom_feito);
    if (outcome === "não_feito") return addXp(userId, "habito_mau_recaida", XP_RULES.habito_mau_recaida);
  }
}

async function updateStreaks(args: { userId: UUID; source: CheckinSource; sourceId: UUID; outcome: CheckinOutcome; ymd: string }) {
  const { userId, source, sourceId, outcome, ymd } = args;
  const positive = outcome === "feito" || (source === "habit" && outcome !== "não_feito");
  if (!positive) return;
  // Global streak counts if at least one positive check-in in the day
  await upsertStreak({ userId, scope: "global", scopeId: null, ymd });
  // Scope streaks
  if (source === "habit") {
    await upsertStreak({ userId, scope: "habit", scopeId: sourceId, ymd });
  }
  if (source === "goal") {
    await upsertStreak({ userId, scope: "goal", scopeId: sourceId, ymd });
  }
}
