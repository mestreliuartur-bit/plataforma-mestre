"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: "Início", href: "/" },
  { label: "Eventos & Rituais", href: "/eventos" },
  { label: "Cursos", href: "/cursos" },
  { label: "Sobre o Mestre", href: "/sobre" },
];

interface PublicNavbarClientProps {
  isLoggedIn: boolean;
  userName?: string;
}

export function PublicNavbarClient({ isLoggedIn, userName }: PublicNavbarClientProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha ao mudar de rota
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Trava scroll quando menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#09090f]/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
              <svg viewBox="0 0 100 100" className="h-5 w-5 text-amber-400" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide text-white">
              Mestre Liu Artur
            </span>
          </Link>

          {/* ── Links desktop ── */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-amber-400"
                    : "text-gray-400 hover:text-white",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Ações desktop ── */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
                <span className="text-xs text-gray-500 hidden lg:block">
                  {userName}
                </span>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  Meu Painel
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:text-white"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>

          {/* ── Botão hamburger mobile ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:text-white md:hidden"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* ── Menu mobile: overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Menu mobile: drawer ── */}
      <div
        className={[
          "fixed left-0 right-0 top-16 z-50 overflow-hidden border-b border-white/5 bg-[#09090f] transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-6 py-6 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                isActive(link.href)
                  ? "bg-amber-400/10 text-amber-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {isActive(link.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
              {link.label}
            </Link>
          ))}

          {/* Divisor */}
          <div className="my-2 border-t border-white/5" />

          {/* Ações mobile */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-base font-semibold text-black"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              Meu Painel
            </Link>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Entrar na minha conta
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-base font-semibold text-black"
              >
                Criar Conta Gratuita
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
