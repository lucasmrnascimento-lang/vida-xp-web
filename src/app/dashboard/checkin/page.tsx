import { RequireAuth } from "@/components/auth/AuthProvider";

export default function DashboardCheckinPage() {
  return (
    <RequireAuth>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Check-ins</h1>
        <p className="text-sm text-foreground/70">Histórico de check-ins — em breve.</p>
      </div>
    </RequireAuth>
  );
}
