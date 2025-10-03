"use client";
import { useState } from "react";
import { createGoal } from "@/lib/goals";
import { useAuth } from "@/components/auth/AuthProvider";
import type { GoalDoc, GoalType } from "@/lib/types";

export function NewGoalForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [type, setType] = useState<GoalType>("livro");
  const [title, setTitle] = useState("");
  const [metricLabel, setMetricLabel] = useState("páginas");
  const [targetValue, setTargetValue] = useState<number | "">("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await createGoal(user.uid, {
        type,
        title,
        metric_label: metricLabel,
        target_value: typeof targetValue === "number" ? targetValue : 0,
        current_value: 0,
        start_date: startDate,
        due_date: dueDate || null,
        status: "em_andamento",
        notes: "",
        created_at: "",
        updated_at: "",
        id: "",
        user_id: user.uid,
      } as unknown as GoalDoc);
      setTitle("");
      setTargetValue("");
      setMetricLabel("páginas");
      onCreated?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao criar meta";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm">
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as GoalType)} className="w-full rounded-md border px-2 py-1 mt-1">
            <option value="livro">Livro</option>
            <option value="curso">Curso</option>
            <option value="personalizada">Personalizada</option>
          </select>
        </label>
        <label className="text-sm">
          Métrica
          <input value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} className="w-full rounded-md border px-2 py-1 mt-1" />
        </label>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome da meta" className="w-full rounded-md border px-2 py-1" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" inputMode="numeric" value={targetValue} onChange={(e) => setTargetValue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Alvo (ex.: 300)" className="rounded-md border px-2 py-1" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-2 py-1" />
      </div>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-md border px-2 py-1" />
      <button disabled={loading} onClick={submit} className="rounded-md border px-3 py-1.5 hover:bg-foreground/5 disabled:opacity-60">Salvar</button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
