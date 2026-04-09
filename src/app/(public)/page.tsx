import Link from "next/link";
import { db } from "@/lib/db";
import { HeroSection } from "./_components/HeroSection";

export const dynamic = "force-dynamic";

// Server Component — sem "use client", sem hydration issues

const MOCK_EVENTS = [
  {
    id: "m1", slug: "ritual-prosperidade-financeira", title: "Ritual de Prosperidade Financeira",
    description: "Poderoso trabalho para abrir os caminhos da abundância e atrair riqueza material para sua vida.",
    price: 297, type: "DISTANCIA" as const, coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=450&fit=crop",
  },
  {
    id: "m2", slug: "limpeza-espiritual-completa", title: "Limpeza Espiritual Completa",
    description: "Descarrego profundo para remover energias negativas, quebrar amarrações e limpar seu campo energético.",
    price: 197, type: "DISTANCIA" as const, coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
  },
  {
    id: "m3", slug: "trabalho-amor-harmonizacao", title: "Trabalho de Amor e Harmonização",
    description: "Ritual de magias brancas para unir casais, restaurar laços e atrair o amor verdadeiro.",
    price: 397, type: "DISTANCIA" as const, coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=450&fit=crop",
  },
  {
    id: "m4", slug: "encontro-energia-vital-maio", title: "Encontro — Energia Vital",
    description: "Workshop presencial intensivo: respiração, meditação profunda e alinhamento dos chakras.",
    price: 497, type: "PRESENCIAL" as const, coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",
  },
  {
    id: "m5", slug: "ritual-saude-cura", title: "Ritual de Saúde e Cura",
    description: "Trabalho espiritual focado na recuperação da saúde física e mental com energias de cura ancestral.",
    price: 347, type: "DISTANCIA" as const, coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=450&fit=crop",
  },
  {
    id: "m6", slug: "gira-umbanda-presencial", title: "Gira de Umbanda Presencial",
    description: "Noite especial de umbanda com o Mestre Liu Artur e seus guias. Consultas individuais durante a gira.",
    price: 350, type: "PRESENCIAL" as const, coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
  },
];

export default async function HomePage() {
  const [banners, dbEvents] = await Promise.all([
    db.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    db.event.findMany({
      where: { isPublished: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const events = dbEvents.length > 0 ? dbEvents : MOCK_EVENTS;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  // Fallback hero se não houver banners no banco ainda
  const herobanners = banners.length > 0 ? banners : [
    {
      id: "default",
      title: "Transformação Espiritual",
      subtitle: "Rituais e trabalhos realizados com respeito, ética e potência ancestral",
      imageUrl: "",
      ctaLabel: "Conhecer Rituais",
      ctaUrl: "#eventos",
      isActive: true,
      order: 0,
    },
  ];

  return (
    <main>
      {/* ── Hero Carrossel ── */}
      <HeroSection banners={herobanners} />

      {/* ── Sobre o Mestre ── */}
      <section className="relative bg-[#0a0a0f] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
                Quem é o Mestre
              </p>
              <h2 className="mb-6 font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
                A força ancestral a{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  seu serviço
                </span>
              </h2>
              <p className="mb-6 leading-relaxed text-gray-400">
                Mestre Liu Artur é um praticante de umbanda e magia há mais de 15 anos.
                Guiado pelos Orixás e pelas forças ancestrais, já transformou milhares de vidas
                através de rituais precisos e trabalhados com respeito e responsabilidade espiritual.
              </p>
              <p className="mb-10 leading-relaxed text-gray-400">
                Seus trabalhos são reconhecidos pela potência e seriedade, sempre alinhados com
                a ética espiritual e o bem maior de quem busca a transformação.
              </p>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
              >
                <span className="font-medium">Conhecer a história completa</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "15+", label: "Anos de Prática" },
                { value: "3.000+", label: "Rituais Realizados" },
                { value: "98%", label: "Casos de Sucesso" },
                { value: "1.200+", label: "Vidas Transformadas" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
                  <div className="mb-2 font-serif text-4xl font-bold text-amber-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Eventos / Rituais ── */}
      <section id="eventos" className="relative bg-[#080810] py-24">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
              Rituais & Eventos
            </p>
            <h2 className="font-serif text-4xl font-bold text-white lg:text-5xl">
              Escolha sua{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                transformação
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Cada ritual é preparado com intenção, energia e conhecimento ancestral para produzir resultados reais na sua vida.
            </p>
          </div>

          {events.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              Nenhum ritual disponível no momento. Volte em breve.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-900/10"
                >
                  {/* Capa */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
                    {event.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.coverImage.startsWith("http")
                          ? event.coverImage
                          : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_16:9,q_auto,f_auto/${event.coverImage}`}
                        alt={event.title}
                        className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg viewBox="0 0 100 100" className="h-24 w-24 text-amber-400" fill="currentColor">
                          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute right-3 top-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        event.type === "PRESENCIAL"
                          ? "bg-emerald-900/70 text-emerald-300"
                          : "bg-blue-900/70 text-blue-300"
                      }`}>
                        {event.type === "PRESENCIAL" ? "Presencial" : "À Distância"}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 font-serif text-xl font-semibold text-white transition-colors group-hover:text-amber-200">
                      {event.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">A partir de</p>
                        <p className="font-serif text-2xl font-bold text-amber-400">
                          {formatPrice(Number(event.price))}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 text-amber-400 transition-all group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 px-8 py-4 font-medium text-amber-400 transition-all hover:border-amber-400/60 hover:bg-amber-400/5"
            >
              Ver todos os Rituais
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section className="relative bg-[#0a0a0f] py-24">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-900/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
              Depoimentos
            </p>
            <h2 className="font-serif text-4xl font-bold text-white">
              Vidas{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                transformadas
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Camila R.", text: "Após o ritual de prosperidade do Mestre Liu Artur, recebi uma promoção que esperava há dois anos. Não tenho dúvidas do poder deste trabalho.", rating: 5 },
              { name: "Roberto M.", text: "Fiz o trabalho à distância e os resultados foram impressionantes. Em menos de 30 dias meu negócio voltou a faturar bem.", rating: 5 },
              { name: "Fernanda S.", text: "O Mestre Liu Artur tem um dom único. Seu ritual de amor reconectou meu casamento de uma forma que eu não acreditava ser possível.", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-gray-300">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-amber-400/80">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="relative overflow-hidden bg-[#080810] py-32">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-900/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
            <svg viewBox="0 0 100 100" className="h-10 w-10 text-amber-400" fill="currentColor">
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
            </svg>
          </div>
          <h2 className="mb-6 font-serif text-4xl font-bold text-white lg:text-5xl">
            Está pronto para a{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              transformação?
            </span>
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-gray-400">
            Não espere mais. Os caminhos que você deseja abrir estão a um ritual de distância.
            O Mestre Liu Artur está pronto para guiá-lo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#eventos"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-10 py-5 text-lg font-semibold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/40 hover:shadow-xl"
            >
              <span>Escolher meu Ritual</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 py-5 text-lg font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Criar minha conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
