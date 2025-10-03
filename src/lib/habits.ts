import { db } from "@/lib/firebase";
import type { HabitDoc, UUID } from "@/lib/types";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";

const HABITS = "habits";

export async function createHabit(userId: UUID, data: Omit<HabitDoc, "id" | "user_id" | "created_at" | "updated_at">): Promise<string> {
  const now = new Date().toISOString();
  const payload: Omit<HabitDoc, "id"> = {
    ...data,
    user_id: userId,
    created_at: now,
    updated_at: now,
  } as Omit<HabitDoc, "id">;
  const created = await addDoc(collection(db, HABITS), payload);
  return created.id;
}

export async function updateHabit(id: UUID, updates: Partial<HabitDoc>) {
  const now = new Date().toISOString();
  await setDoc(doc(collection(db, HABITS), id), { ...updates, updated_at: now } as Partial<HabitDoc>, { merge: true });
}

export async function getHabitById(id: UUID) {
  const snap = await getDoc(doc(collection(db, HABITS), id));
  return snap.exists() ? (snap.data() as HabitDoc) : null;
}

export async function listHabits(userId: UUID): Promise<HabitDoc[]> {
  const q = query(collection(db, HABITS), where("user_id", "==", userId), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HabitDoc, "id">) }));
}
