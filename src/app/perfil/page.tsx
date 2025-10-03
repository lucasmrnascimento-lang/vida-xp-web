"use client";
import { RequireAuth, useAuth } from "@/components/auth/AuthProvider";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}

function ProfileInner() {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Perfil</h1>
      <div className="border rounded-xl p-4 space-y-2">
        <div className="text-sm"><b>Email:</b> {user?.email}</div>
        <div className="text-sm text-foreground/70">Fuso horário padrão: America/Sao_Paulo</div>
      </div>
    </div>
  );
}
