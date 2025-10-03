import { db } from "@/lib/firebase";
import type { GoalDoc, UUID } from "@/lib/types";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";

const GOALS = "goals";

export async function createGoal(userId: UUID, data: Omit<GoalDoc, "id" | "user_id" | "created_at" | "updated_at" | "current_value" | "status">): Promise<string> {
  if (data.target_value <= 0) throw new Error("target_value deve ser > 0");
  const now = new Date().toISOString();
  const payload: Omit<GoalDoc, "id"> = {
    ...data,
    user_id: userId,
    current_value: 0,
    status: "em_andamento",
    created_at: now,
    updated_at: now,
  } as Omit<GoalDoc, "id">;
  const created = await addDoc(collection(db, GOALS), payload);
  return created.id;
}

export async function updateGoal(id: UUID, updates: Partial<GoalDoc>) {
  const now = new Date().toISOString();
  const ref = doc(collection(db, GOALS), id);
  await setDoc(ref, { ...updates, updated_at: now } as Partial<GoalDoc>, { merge: true });
}

export async function getGoalById(id: UUID) {
  const ref = doc(collection(db, GOALS), id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as GoalDoc) : null;
}

export async function listGoals(userId: UUID): Promise<GoalDoc[]> {
  const q = query(collection(db, GOALS), where("user_id", "==", userId), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GoalDoc, "id">) }));
}
