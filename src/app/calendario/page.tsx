import { RequireAuth } from "@/components/auth/AuthProvider";
import { EventForm } from "@/app/calendario/components/EventForm";

export default function CalendarPage() {
  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Calendário</h1>
        <EventForm />
      </div>
    </RequireAuth>
  );
}
