"use client";
import { useState } from "react";
import { createHabit } from "@/lib/habits";
import { useAuth } from "@/components/auth/AuthProvider";
import type { HabitDoc, HabitSchedule, HabitType } from "@/lib/types";

export function NewHabitForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState<HabitType>("bom");
  const [schedule, setSchedule] = useState<HabitSchedule>("diário");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [targetPerDay, setTargetPerDay] = useState<number | "">(1);
  const [unitLabel, setUnitLabel] = useState("min");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDay(d: string) {
    setDaysOfWeek((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function submit() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await createHabit(user.uid, {
        name,
        type,
        schedule,
        days_of_week: schedule === "dias_da_semana" ? daysOfWeek : [],
        target_per_day: typeof targetPerDay === "number" ? targetPerDay : 1,
        unit_label: unitLabel,
        active: true,
        created_at: "",
        updated_at: "",
        id: "",
        user_id: user.uid,
      } as unknown as HabitDoc);
      setName("");
      setTargetPerDay(1);
      setUnitLabel("min");
      setDaysOfWeek([]);
      onCreated?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao criar hábito";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do hábito" className="w-full rounded-md border px-2 py-1" />
      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm">
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as HabitType)} className="w-full rounded-md border px-2 py-1 mt-1">
            <option value="bom">Bom</option>
            <option value="mau">Mau</option>
          </select>
        </label>
        <label className="text-sm">
          Agenda
+          <select value={schedule} onChange={(e) => setSchedule(e.target.value as HabitSchedule)} className="w-full rounded-md border px-2 py-1 mt-1">
+            <option value="diário">Diário</option>
+            <option value="dias_da_semana">Dias da semana</option>
+            <option value="custom">Custom</option>
+          </select>
        </label>
      </div>
      {schedule === "dias_da_semana" && (
        <div className="flex gap-2 text-sm">
          {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => toggleDay(d)}
              className={`px-2 py-1 rounded-md border ${daysOfWeek.includes(d) ? "bg-foreground/10" : ""}`}
            >
              {d}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <input type="number" inputMode="numeric" value={targetPerDay} onChange={(e) => setTargetPerDay(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Meta diária (ex.: 30)" className="rounded-md border px-2 py-1" />
        <input value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)} placeholder="Unidade (ex.: min)" className="rounded-md border px-2 py-1" />
      </div>
      <button disabled={loading} onClick={submit} className="rounded-md border px-3 py-1.5 hover:bg-foreground/5 disabled:opacity-60">Salvar</button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
