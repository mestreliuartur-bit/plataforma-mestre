import Link from "next/link";
import { auth } from "@/auth";
import { PublicNavbarClient } from "@/components/layout/PublicNavbar";

// Server Component — busca session e delega o estado mobile ao Client Component
async function Navbar() {
  const session = await auth();
  return (
    <PublicNavbarClient
      isLoggedIn={!!session?.user}
      userName={session?.user?.name ?? undefined}
    />
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080810] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/20">
                <svg viewBox="0 0 100 100" className="h-4 w-4 text-amber-400" fill="currentColor">
                  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                </svg>
              </div>
              <span className="font-serif text-sm font-semibold text-white/70">Mestre Liu Artur</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-600">
              Rituais e eventos esotéricos realizados com respeito, ética e responsabilidade espiritual há mais de 15 anos.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">Plataforma</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Início", href: "/" },
                { label: "Eventos & Rituais", href: "/eventos" },
                { label: "Cursos", href: "/cursos" },
                { label: "Sobre o Mestre", href: "/sobre" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Conta */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">Minha Conta</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Entrar", href: "/login" },
                { label: "Criar Conta", href: "/register" },
                { label: "Meu Dashboard", href: "/dashboard" },
                { label: "Meus Eventos", href: "/dashboard/meus-eventos" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal + Contato */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">Legal</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Privacidade", href: "/politica-de-privacidade" },
                { label: "Termos de Uso", href: "/termos-de-uso" },
                { label: "Contato", href: "/contato" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href="https://wa.me/5511910998013"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-xs text-green-600 transition-colors hover:text-green-400"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center">
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
