import { RequireAuth } from "@/components/auth/AuthProvider";
import { NewGoalForm } from "@/app/metas/components/NewGoalForm";

export default function GoalsPage() {
  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Metas</h1>
        <NewGoalForm />
      </div>
    </RequireAuth>
  );
}
