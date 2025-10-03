import { RequireAuth } from "@/components/auth/AuthProvider";
import { NewHabitForm } from "@/app/habitos/components/NewHabitForm";

export default function HabitsPage() {
  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Hábitos</h1>
        <NewHabitForm />
      </div>
    </RequireAuth>
  );
}
