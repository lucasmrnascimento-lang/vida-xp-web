"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function loginGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Entrar</h1>
        <button onClick={loginGoogle} className="w-full rounded-md border px-4 py-2 hover:bg-foreground/5">
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
