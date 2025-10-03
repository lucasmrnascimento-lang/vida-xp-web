import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import type { UserDoc } from "@/lib/types";

const DEFAULT_TZ = "America/Sao_Paulo";

export async function ensureUserDocument(firebaseUser: User): Promise<UserDoc> {
  const userRef = doc(collection(db, "users"), firebaseUser.uid);
  const snap = await getDoc(userRef);
  const nowIso = new Date().toISOString();
  if (!snap.exists()) {
    const newDoc: UserDoc = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName ?? null,
      email: firebaseUser.email ?? null,
      timezone: DEFAULT_TZ,
      created_at: nowIso,
    };
    await setDoc(userRef, newDoc, { merge: true });
    return newDoc;
  }
  const data = snap.data() as UserDoc;
  if (!data.timezone) {
    data.timezone = DEFAULT_TZ;
    await setDoc(userRef, data, { merge: true });
  }
  return data;
}
