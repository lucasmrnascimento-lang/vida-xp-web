import { db } from "@/lib/firebase";
import type { StreakDoc, StreakScope, UUID } from "@/lib/types";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export function streakDocId(userId: UUID, scope: StreakScope, scopeId?: UUID | null) {
  if (scope === "global") return `${userId}__global`;
  return `${userId}__${scope}__${scopeId}`;
}

export async function getStreak(userId: UUID, scope: StreakScope, scopeId?: UUID | null): Promise<StreakDoc | null> {
  const id = streakDocId(userId, scope, scopeId ?? null);
  const ref = doc(collection(db, "streaks"), id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as StreakDoc) : null;
}

export async function upsertStreak(args: {
  userId: UUID;
  scope: StreakScope;
  scopeId?: UUID | null;
  ymd: string; // YYYY-MM-DD
}): Promise<StreakDoc> {
  const { userId, scope, scopeId, ymd } = args;
  const id = streakDocId(userId, scope, scopeId ?? null);
  const ref = doc(collection(db, "streaks"), id);
  const existingSnap = await getDoc(ref);
  // const now = new Date().toISOString();
  if (!existingSnap.exists()) {
    const created: StreakDoc = {
      id,
      user_id: userId,
      scope,
      scope_id: scope === "global" ? null : (scopeId ?? null),
      current_streak: 1,
      longest_streak: 1,
      last_check_date: ymd,
    };
    await setDoc(ref, created, { merge: true });
    return created;
  }
  const prev = existingSnap.data() as StreakDoc;
  // no double count same day
  if (prev.last_check_date === ymd) return prev;
  const isConsecutive = isConsecutiveDay(prev.last_check_date, ymd);
  const current = isConsecutive ? prev.current_streak + 1 : 1;
  const longest = Math.max(prev.longest_streak ?? 0, current);
  const updated: StreakDoc = {
    ...prev,
    current_streak: current,
    longest_streak: longest,
    last_check_date: ymd,
  };
  await setDoc(ref, updated, { merge: true });
  return updated;
}

export function isConsecutiveDay(prevYmd: string, ymd: string): boolean {
  const prev = new Date(prevYmd + "T00:00:00");
  const curr = new Date(ymd + "T00:00:00");
  const diff = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
  return diff === 1;
}
