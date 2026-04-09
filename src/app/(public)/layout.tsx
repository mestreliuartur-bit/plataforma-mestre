import Link from "next/link";
import { auth } from "@/auth";

// ─────────────────────────────────────────
// NAVBAR — Área Pública
// ─────────────────────────────────────────

async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
            <svg viewBox="0 0 100 100" className="h-5 w-5 text-amber-400" fill="currentColor">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            </svg>
          </div>
          <span className="font-serif text-lg font-semibold tracking-wide text-white">
            Mestre Liu Artur
          </span>
        </Link>

        {/* Links centrais */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/eventos" className="text-sm text-gray-400 transition-colors hover:text-white">
            Rituais & Eventos
          </Link>
          <Link href="/sobre" className="text-sm text-gray-400 transition-colors hover:text-white">
            Sobre o Mestre
          </Link>
          <Link href="/#depoimentos" className="text-sm text-gray-400 transition-colors hover:text-white">
            Depoimentos
          </Link>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
            >
              Meu Painel
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30 sm:px-5 sm:py-2 sm:text-sm"
              >
                <span className="sm:hidden">Começar</span>
                <span className="hidden sm:inline">Começar agora</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080810] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/20">
              <svg viewBox="0 0 100 100" className="h-4 w-4 text-amber-400" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
            </div>
            <span className="font-serif text-sm font-semibold text-white/70">
              Mestre Liu Artur
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-gray-600">
            Rituais e eventos esotéricos realizados com respeito, ética e responsabilidade espiritual.
          </p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="text-xs text-gray-600 hover:text-gray-400">
              Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-xs text-gray-600 hover:text-gray-400">
              Termos de Uso
            </Link>
            <Link href="/contato" className="text-xs text-gray-600 hover:text-gray-400">
              Contato
            </Link>
          </div>
          <p className="text-xs text-gray-700">
            © {new Date().getFullYear()} Mestre Liu Artur. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
