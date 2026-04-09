import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EventCarousel, type CarouselEvent } from "@/components/EventCarousel";

// ─────────────────────────────────────────
// MOCK — 12 eventos para visualização imediata
// (substituídos pelos dados reais do banco quando existirem)
// ─────────────────────────────────────────

const MOCK_EVENTS: (CarouselEvent & { category: string })[] = [
  {
    id: "m1", slug: "ritual-prosperidade-financeira", category: "prosperidade",
    title: "Ritual de Prosperidade Financeira",
    description: "Poderoso trabalho para abrir os caminhos da abundância e atrair riqueza material para sua vida.",
    price: 297, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m2", slug: "limpeza-espiritual-completa", category: "limpeza",
    title: "Limpeza Espiritual Completa",
    description: "Descarrego profundo para remover energias negativas, quebrar amarrações e limpar seu campo energético.",
    price: 197, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m3", slug: "trabalho-amor-harmonizacao", category: "amor",
    title: "Trabalho de Amor e Harmonização",
    description: "Ritual de magias brancas para unir casais, restaurar laços e atrair o amor verdadeiro.",
    price: 397, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m4", slug: "encontro-energia-vital-maio", category: "presencial",
    title: "Encontro — Energia Vital",
    description: "Workshop presencial intensivo: respiração, meditação profunda e alinhamento dos chakras.",
    price: 497, type: "PRESENCIAL",
    eventDate: "2026-05-10T09:00:00",
    maxSlots: 12,
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m5", slug: "ritual-saude-cura", category: "prosperidade",
    title: "Ritual de Saúde e Cura",
    description: "Trabalho espiritual focado na recuperação da saúde física e mental com energias de cura ancestral.",
    price: 347, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m6", slug: "abertura-caminhos-exu", category: "exu",
    title: "Abertura de Caminhos — Exu",
    description: "Trabalho com Exu para destravar situações bloqueadas, quebrar obstáculos e abrir novas oportunidades.",
    price: 247, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m7", slug: "protecao-espiritual-escudo", category: "protecao",
    title: "Escudo de Proteção Espiritual",
    description: "Ritual de blindagem energética contra inveja, mau-olhado e ataques espirituais.",
    price: 217, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m8", slug: "gira-umbanda-presencial", category: "presencial",
    title: "Gira de Umbanda Presencial",
    description: "Noite especial de umbanda com o Mestre Liu Artur e seus guias. Consultas individuais durante a gira.",
    price: 350, type: "PRESENCIAL",
    eventDate: "2026-04-25T20:00:00",
    maxSlots: 20,
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m9", slug: "ritual-emprego-sucesso", category: "prosperidade",
    title: "Ritual de Emprego e Sucesso Profissional",
    description: "Abre caminhos específicos para oportunidades de emprego, promoções e reconhecimento profissional.",
    price: 267, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m10", slug: "consulta-jogo-buzios", category: "exu",
    title: "Consulta no Jogo de Búzios",
    description: "Consulta individual com o Mestre Liu Artur pelo jogo de búzios para leitura do seu Odu e orientação espiritual.",
    price: 177, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m11", slug: "ritual-amor-retorno", category: "amor",
    title: "Ritual de Retorno Amoroso",
    description: "Trabalho especial para reatar relacionamentos desfeitos com amor, respeito e ética espiritual.",
    price: 447, type: "DISTANCIA",
    coverImage: "https://images.unsplash.com/photo-1518606372054-c3cc96e0dcd9?w=400&h=711&fit=crop&crop=center",
  },
  {
    id: "m12", slug: "workshop-mediunidade", category: "presencial",
    title: "Workshop de Desenvolvimento Mediúnico",
    description: "Aprenda a reconhecer e desenvolver seus dons mediúnicos com segurança e orientação espiritual.",
    price: 397, type: "PRESENCIAL",
    eventDate: "2026-06-07T09:00:00",
    maxSlots: 15,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=711&fit=crop&crop=center",
  },
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function toCarouselEvent(e: {
  id: string; slug: string; title: string; description: string;
  price: { toString(): string } | number | null; coverImage: string | null;
  type: "PRESENCIAL" | "DISTANCIA"; eventDate?: Date | null; maxSlots?: number | null;
  isWhatsappLead?: boolean; whatsappNumber?: string | null; whatsappMessage?: string | null;
}): CarouselEvent {
  return {
    id: e.id, slug: e.slug, title: e.title, description: e.description,
    price: e.price !== null ? Number(e.price) : null,
    coverImage: e.coverImage, type: e.type,
    eventDate: e.eventDate, maxSlots: e.maxSlots,
    isWhatsappLead: e.isWhatsappLead ?? false,
    whatsappNumber: e.whatsappNumber,
    whatsappMessage: e.whatsappMessage,
  };
}

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────

export default async function EventosPage() {
  const session = await auth();

  // Busca eventos reais do banco
  const dbEvents = await db.event.findMany({
    where: { isPublished: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // Se não houver eventos no banco, usa os mocks
  const usesMock = dbEvents.length === 0;

  // Compras do usuário logado
  let purchasedIds = new Set<string>();
  let purchasedEvents: CarouselEvent[] = [];

  if (session?.user?.id) {
    const purchases = await db.purchase.findMany({
      where: { userId: session.user.id, status: "CONFIRMED" },
      include: { event: true },
    });
    purchasedIds = new Set(purchases.map((p) => p.eventId));
    purchasedEvents = purchases.map((p) => toCarouselEvent(p.event));
  }

  // Prepara as rows de carrosséis
  // Com dados reais: divide em PRESENCIAL | DISTANCIA | todos
  // Com mock: usa as categorias temáticas
  type AccentColor = "amber" | "purple" | "blue" | "emerald";
  let rows: { id: string; title: string; subtitle: string; events: CarouselEvent[]; accent: AccentColor }[] = [];

  if (usesMock) {
    const byCategory = (cat: string) =>
      MOCK_EVENTS.filter((e) => e.category === cat).map(({ category: _c, ...e }) => e);

    rows = [
      { id: "lancamentos", title: "Lançamentos", subtitle: "Novidades", events: MOCK_EVENTS.slice(0, 6).map(({ category: _c, ...e }) => e), accent: "amber" as AccentColor },
      { id: "prosperidade", title: "Rituais de Prosperidade", subtitle: "Abundância & Sucesso", events: byCategory("prosperidade"), accent: "amber" as AccentColor },
      { id: "amor", title: "Caminhos do Amor", subtitle: "Relacionamentos & União", events: byCategory("amor"), accent: "purple" as AccentColor },
      { id: "exu", title: "Trabalhos de Exu", subtitle: "Abertura de Caminhos", events: byCategory("exu"), accent: "blue" as AccentColor },
      { id: "protecao", title: "Proteção Espiritual", subtitle: "Blindagem & Defesa", events: byCategory("protecao"), accent: "purple" as AccentColor },
      { id: "presencial", title: "Eventos Presenciais", subtitle: "Encontros ao Vivo", events: byCategory("presencial"), accent: "emerald" as AccentColor },
    ].filter((r) => r.events.length > 0);
  } else {
    const presencial = dbEvents.filter((e) => e.type === "PRESENCIAL").map(toCarouselEvent);
    const distancia = dbEvents.filter((e) => e.type === "DISTANCIA").map(toCarouselEvent);
    const todos = dbEvents.map(toCarouselEvent);

    rows = [
      { id: "lancamentos", title: "Lançamentos", subtitle: "Mais Recentes", events: todos.slice(0, 8), accent: "amber" as AccentColor },
      { id: "distancia", title: "Rituais à Distância", subtitle: "De onde você estiver", events: distancia, accent: "purple" as AccentColor },
      { id: "presencial", title: "Eventos Presenciais", subtitle: "Encontros ao Vivo", events: presencial, accent: "emerald" as AccentColor },
    ].filter((r) => r.events.length > 0);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ── Hero da página ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 pt-24 pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber-900/10 blur-[100px]" />
          <div className="absolute right-0 top-0 h-[200px] w-[400px] rounded-full bg-purple-900/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400/60">
            Catálogo Completo
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-white lg:text-5xl">
            Eventos & Rituais
          </h1>
          <p className="mt-3 max-w-xl text-gray-400">
            Escolha o ritual que ressoa com sua necessidade. Cada trabalho é realizado com
            intenção, ética e conhecimento ancestral pelo Mestre Liu Artur.
          </p>

          {/* Stats rápidos */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "Rituais disponíveis", value: usesMock ? "12" : String(dbEvents.length) },
              { label: "Anos de experiência", value: "15+" },
              { label: "Vidas transformadas", value: "1.200+" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl font-bold text-amber-400">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Banner: visitante não logado ── */}
      {!session && (
        <div className="mx-auto max-w-7xl px-6 lg:px-12 mt-6">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-400/15 bg-amber-400/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 100" className="h-8 w-8 flex-shrink-0 text-amber-400/70" fill="currentColor">
                <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white">
                  Crie sua conta e tenha acesso a condições exclusivas
                </p>
                <p className="text-xs text-gray-500">
                  Membros recebem ofertas especiais e acesso antecipado a novos rituais.
                </p>
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <Link
                href="/login"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-amber-300"
              >
                Criar conta grátis
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Conteúdo principal ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 space-y-8">

        {/* Row "Continuar Jornada" — apenas logados com compras */}
        {session && purchasedEvents.length > 0 && (
          <EventCarousel
            title="Continuar Jornada"
            subtitle="Meus Rituais"
            events={purchasedEvents}
            purchasedIds={purchasedIds}
            viewAllHref="/dashboard/meus-eventos"
            accentColor="amber"
            bgColor="from-zinc-950"
          />
        )}

        {/* Banner para logados sem compras */}
        {session && purchasedEvents.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 mb-4">
            <p className="text-sm text-gray-400">
              Você ainda não adquiriu nenhum ritual.{" "}
              <span className="text-amber-400">Escolha abaixo e comece sua transformação.</span>
            </p>
          </div>
        )}

        {/* Rows de carrosséis por categoria */}
        {rows.map((row) => (
          <EventCarousel
            key={row.id}
            title={row.title}
            subtitle={row.subtitle}
            events={row.events}
            purchasedIds={purchasedIds}
            accentColor={row.accent}
            bgColor="from-zinc-950"
          />
        ))}
      </div>

      {/* ── CTA final ── */}
      <div className="mt-8 border-t border-white/5 bg-zinc-900/50 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-amber-400/60">
            Dúvidas?
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white">
            Não sabe qual ritual escolher?
          </h2>
          <p className="mt-3 text-gray-400">
            Entre em contato e o Mestre Liu Artur irá guiá-lo para o trabalho mais adequado à sua situação.
          </p>
          <a
            href="https://wa.me/5511910998013"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
