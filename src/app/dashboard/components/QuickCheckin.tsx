"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createCheckin } from "@/lib/checkins";

export function QuickCheckin() {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const ymd = new Date().toISOString().slice(0, 10);
      await createCheckin({
        userId: user.uid,
        ymd,
        source: "event",
        sourceId: "quick-checkin",
        outcome: "feito",
        quantity: typeof quantity === "number" ? quantity : undefined,
        notes,
      });
      setMessage("Streak mantida! +10 XP");
      setQuantity("");
      setNotes("");
    } catch {
      setMessage("Erro ao registrar check-in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-foreground/70">Check-in rápido (evento genérico)</div>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Quantidade (opcional)"
          className="w-40 rounded-md border px-2 py-1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Notas"
          className="flex-1 rounded-md border px-2 py-1"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          disabled={loading}
          onClick={submit}
          className="rounded-md border px-3 py-1.5 hover:bg-foreground/5 disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Check-in"}
        </button>
      </div>
      {message && <div className="text-sm text-foreground/80">{message}</div>}
    </div>
  );
}
