import { db } from "@/lib/firebase";
import type { EventDoc, UUID } from "@/lib/types";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";

const EVENTS = "events";

export async function getEventById(id: UUID) {
  const ref = doc(collection(db, EVENTS), id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as EventDoc) : null;
}

export async function createEvent(userId: UUID, data: Omit<EventDoc, "id" | "user_id" | "created_at" | "updated_at">): Promise<string> {
  if (new Date(data.end_datetime).getTime() < new Date(data.start_datetime).getTime()) {
    throw new Error("end_datetime não pode ser menor que start_datetime");
  }
  const now = new Date().toISOString();
  const payload: Omit<EventDoc, "id"> = {
    ...data,
    user_id: userId,
    created_at: now,
    updated_at: now,
  } as Omit<EventDoc, "id">;
  const col = collection(db, EVENTS);
  const created = await addDoc(col, payload);
  return created.id;
}

export async function updateEvent(id: UUID, updates: Partial<EventDoc>) {
  const now = new Date().toISOString();
  const ref = doc(collection(db, EVENTS), id);
  const toWrite = { ...updates, updated_at: now } as Partial<EventDoc>;
  await setDoc(ref, toWrite, { merge: true });
}

export async function listEventsInRange(userId: UUID, startIso: string, endIso: string): Promise<EventDoc[]> {
  const col = collection(db, EVENTS);
  const q = query(
    col,
    where("user_id", "==", userId),
    where("start_datetime", ">=", startIso),
    where("start_datetime", "<=", endIso),
    orderBy("start_datetime", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventDoc, "id">) }));
}
