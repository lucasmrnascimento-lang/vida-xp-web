import { RequireAuth } from "@/components/auth/AuthProvider";

export default function FeedPage() {
  return (
    <RequireAuth>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Feed</h1>
        <p className="text-sm text-foreground/70">Atualizações e histórico — em breve.</p>
      </div>
    </RequireAuth>
  );
}

