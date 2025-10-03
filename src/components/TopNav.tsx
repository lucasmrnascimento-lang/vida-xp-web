"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendario", label: "Calendário" },
  { href: "/metas", label: "Metas" },
  { href: "/habitos", label: "Hábitos" },
  { href: "/gamificacao", label: "Gamificação" },
  { href: "/perfil", label: "Perfil" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const hideOn = ["/login", "/onboarding"]; // Hide nav on auth/onboarding
  if (hideOn.some((p) => pathname?.startsWith(p))) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <div className="font-semibold">Vida XP</div>
        <div className="hidden md:flex gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname?.startsWith(link.href)
                  ? "text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-foreground/70 max-w-[160px] truncate">{user.email}</span>
              <button
                onClick={logout}
                className="rounded-md border px-3 py-1.5 hover:bg-foreground/5"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-md border px-3 py-1.5">Entrar</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
