"use client";
import { RequireAuth, useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { XpTransactionDoc } from "@/lib/types";
import { levelFromXp } from "@/lib/xp";

export default function GamificationPage() {
  return (
    <RequireAuth>
      <GamificationInner />
    </RequireAuth>
  );
}

function GamificationInner() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<XpTransactionDoc[]>([]);
  const totalXp = useMemo(() => txs.reduce((sum, t) => sum + (t.xp_delta ?? 0), 0), [txs]);
  const level = levelFromXp(totalXp);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const q1 = query(collection(db, "xp_transactions"), where("user_id", "==", user.uid));
      const snap = await getDocs(q1);
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<XpTransactionDoc, "id">) }));
      setTxs(rows);
    })();
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Gamificação</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-foreground/70">XP Total</div>
          <div className="text-2xl font-semibold">{totalXp}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-foreground/70">Nível</div>
          <div className="text-2xl font-semibold">{level.level}</div>
          <div className="text-xs text-foreground/70">Progresso: {(level.progressToNext * 100).toFixed(0)}%</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-foreground/70">Próximo nível</div>
          <div className="text-2xl font-semibold">{level.nextLevelBase} XP</div>
        </div>
      </div>
      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Histórico de XP</h2>
        <ul className="text-sm space-y-1">
          {txs.slice(0, 20).map((t) => (
            <li key={t.id} className="flex justify-between">
              <span>{t.reason}</span>
              <span className={t.xp_delta >= 0 ? "text-green-600" : "text-red-600"}>{t.xp_delta > 0 ? `+${t.xp_delta}` : t.xp_delta}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
