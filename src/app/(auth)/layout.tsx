import Link from "next/link";

// Layout exclusivo para as páginas de auth (Login / Cadastro)
// Sem Navbar pública — foco total no formulário

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* ── Orbes místicos de fundo ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Orbe roxo — canto superior direito */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
        {/* Orbe dourado — canto inferior esquerdo */}
        <div className="absolute -bottom-48 -left-24 h-[400px] w-[400px] rounded-full bg-amber-900/15 blur-[100px]" />
        {/* Orbe azul-escuro — centro */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[140px]" />
      </div>

      {/* ── Grade decorativa (grid de pontos) ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Linha de topo dourada ── */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* ── Header mínimo ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/5 transition-all group-hover:border-amber-400/60 group-hover:bg-amber-400/10">
            <svg viewBox="0 0 100 100" className="h-5 w-5 text-amber-400" fill="currentColor">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            </svg>
          </div>
          <span className="font-serif text-sm font-semibold tracking-wide text-white/70 transition-colors group-hover:text-white">
            Mestre Liu Artur
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-gray-300"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao início
        </Link>
      </header>

      {/* ── Conteúdo principal (formulário) ── */}
      <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
