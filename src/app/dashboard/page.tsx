import { RequireAuth } from "@/components/auth/AuthProvider";
import { QuickCheckin } from "@/app/dashboard/components/QuickCheckin";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl p-4 space-y-4">
          <h2 className="font-semibold">Hoje</h2>
          <QuickCheckin />
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Metas</h2>
          <p className="text-sm text-foreground/70">Top 3 por % de conclusão</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Hábitos</h2>
          <p className="text-sm text-foreground/70">Bons e maus do dia</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Gamificação</h2>
          <p className="text-sm text-foreground/70">XP total, nível, streak</p>
        </div>
      </div>
    </RequireAuth>
  );
}
