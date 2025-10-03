"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HABIT_PRESETS, GOAL_PRESETS } from "@/lib/presets";
import { createGoal } from "@/lib/goals";
import { createHabit } from "@/lib/habits";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  async function start() {
    if (!user) return;
    setBusy(true);
    try {
      for (const gid of selectedGoals) {
        const preset = GOAL_PRESETS.find((g) => g.id === gid)!;
        await createGoal(user.uid, {
          type: preset.title.toLowerCase() === "livro" ? "livro" : preset.title.toLowerCase() === "curso" ? "curso" : "personalizada",
          title: preset.title,
          metric_label: preset.metric_label ?? "unidades",
          target_value: preset.target_value ?? 1,
          current_value: 0,
          start_date: new Date().toISOString().slice(0, 10),
          due_date: null,
          status: "em_andamento",
          notes: "",
          created_at: "",
          updated_at: "",
          id: "",
          user_id: user.uid,
        } as unknown as never);
      }
      for (const hid of selectedHabits) {
        const preset = HABIT_PRESETS.find((h) => h.id === hid)!;
        await createHabit(user.uid, {
          name: preset.title,
          type: preset.title === "Evitar pornografia" || preset.title === "Reduzir tempo de tela" ? "mau" : "bom",
          schedule: "diário",
          days_of_week: [],
          target_per_day: preset.target_value ?? 1,
          unit_label: preset.unit_label ?? "vezes",
          active: true,
          created_at: "",
          updated_at: "",
          id: "",
          user_id: user.uid,
        } as unknown as never);
      }
      router.replace("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Bem-vindo(a)! Vamos configurar seu app</h1>
      <div className="space-y-2">
        <h2 className="font-semibold">Metas iniciais</h2>
        <div className="grid md:grid-cols-3 gap-2">
          {GOAL_PRESETS.map((g) => (
            <label key={g.id} className="border rounded-md p-2 flex items-center gap-2">
              <input type="checkbox" checked={selectedGoals.includes(g.id)} onChange={(e) => setSelectedGoals((prev) => e.target.checked ? [...prev, g.id] : prev.filter((x) => x !== g.id))} />
              <span>{g.title}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Hábitos iniciais</h2>
        <div className="grid md:grid-cols-3 gap-2">
          {HABIT_PRESETS.map((h) => (
            <label key={h.id} className="border rounded-md p-2 flex items-center gap-2">
              <input type="checkbox" checked={selectedHabits.includes(h.id)} onChange={(e) => setSelectedHabits((prev) => e.target.checked ? [...prev, h.id] : prev.filter((x) => x !== h.id))} />
              <span>{h.title}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button disabled={busy} onClick={start} className="rounded-md border px-4 py-2 hover:bg-foreground/5 disabled:opacity-60">Começar</button>
      </div>
    </div>
  );
}
