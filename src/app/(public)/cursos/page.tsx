import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  UMBANDA: "Umbanda",
  MAGIA: "Magia",
  ESPIRITUALIDADE: "Espiritualidade",
  RITUAIS: "Rituais",
  MEDITACAO: "Meditação",
  ASTROLOGIA: "Astrologia",
  TAROT: "Tarot",
  OUTROS: "Outros",
};

const MOCK_COURSES = [
  {
    id: "c1", slug: "fundamentos-de-umbanda", title: "Fundamentos de Umbanda",
    description: "Aprenda os pilares da Umbanda: Orixás, guias, linhas de trabalho e a ética espiritual.",
    coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=711&fit=crop",
    category: "UMBANDA", isWhatsappLead: true, price: null,
    _count: { modules: 6, enrollments: 234 }, enrollments: [] as { userId: string }[],
  },
  {
    id: "c2", slug: "magia-branca-pratica", title: "Magia Branca na Prática",
    description: "Rituais de proteção, cura e prosperidade com ingredientes naturais.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop",
    category: "MAGIA", isWhatsappLead: true, price: null,
    _count: { modules: 8, enrollments: 189 }, enrollments: [] as { userId: string }[],
  },
  {
    id: "c3", slug: "meditacao-e-chakras", title: "Meditação & Chakras",
    description: "Desbloqueie seus centros energéticos e eleve sua vibração.",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=711&fit=crop",
    category: "MEDITACAO", isWhatsappLead: true, price: null,
    _count: { modules: 5, enrollments: 312 }, enrollments: [] as { userId: string }[],
  },
  {
    id: "c4", slug: "tarot-dos-orixas", title: "Tarot dos Orixás",
    description: "Leitura do Tarot com a linguagem e arquétipos dos Orixás africanos.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=711&fit=crop",
    category: "TAROT", isWhatsappLead: true, price: null,
    _count: { modules: 4, enrollments: 156 }, enrollments: [] as { userId: string }[],
  },
];

const formatBRL = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

export default async function CursosPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const dbCourses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { modules: true, enrollments: true } },
      enrollments: userId ? { where: { userId } } : false,
    },
  });

  const courses = dbCourses.length > 0 ? dbCourses : MOCK_COURSES;

  // Agrupa por categoria para os carrosséis
  const byCategory = courses.reduce<Record<string, typeof courses>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});
  const categories = Object.keys(byCategory);

  function isEnrolled(course: { enrollments: { userId: string }[] }) {
    return userId ? course.enrollments.some((e) => e.userId === userId) : false;
  }

  return (
    <main className="min-h-screen bg-[#080810]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0d1a] to-[#080810] py-24">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-900/10 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
            Formações & Treinamentos
          </p>
          <h1 className="font-serif text-5xl font-bold text-white lg:text-6xl">
            Cursos do{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Mestre Liu Artur
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-400">
            Conhecimento ancestral em formato digital. Adquira o curso, acesse sua área de membro e aprenda no seu ritmo.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.63 48.63 0 0112 20.904a48.63 48.63 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              {courses.length} curso{courses.length !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span>Acesso vitalício após a compra</span>
            <span>·</span>
            <span>Suporte do Mestre</span>
          </div>
        </div>
      </section>

      {/* ── Banner para usuário logado com cursos ── */}
      {session && (
        <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-400/15 bg-amber-400/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-sm text-gray-300">
                Já adquiriu um curso?{" "}
                <span className="text-amber-400">Acesse sua área de membro.</span>
              </p>
            </div>
            <Link
              href="/dashboard/cursos"
              className="flex-shrink-0 rounded-lg border border-amber-400/30 px-4 py-2 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/10"
            >
              Meus Cursos →
            </Link>
          </div>
        </div>
      )}

      {/* ── Catálogo por categoria ── */}
      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12 lg:px-12">
        {categories.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            Nenhum curso disponível no momento. Volte em breve.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold text-white">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Grid de cards 9:16 */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {byCategory[category].map((course) => {
                  const enrolled = isEnrolled(course as { enrollments: { userId: string }[] });

                  return (
                    <Link
                      key={course.id}
                      href={`/cursos/${course.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-900/10"
                    >
                      {/* Capa 9:16 */}
                      <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
                        {course.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              course.coverImage.startsWith("http")
                                ? course.coverImage
                                : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_9:16,q_auto,f_auto/${course.coverImage}`
                            }
                            alt={course.title}
                            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <svg viewBox="0 0 100 100" className="h-16 w-16 text-amber-400/20" fill="currentColor">
                              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />

                        {/* Badge já adquirido */}
                        {enrolled && (
                          <div className="absolute right-2 top-2">
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Adquirido
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="rounded-full border border-white/30 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                            Ver detalhes →
                          </div>
                        </div>

                        {/* Info base */}
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="text-[10px] text-gray-400">
                            {course._count.modules} módulo{course._count.modules !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Texto */}
                      <div className="p-3">
                        <h3 className="text-xs font-semibold leading-tight text-white line-clamp-2 transition-colors group-hover:text-amber-200">
                          {course.title}
                        </h3>
                        <div className="mt-1.5">
                          {course.isWhatsappLead ? (
                            <p className="flex items-center gap-1 text-[10px] font-semibold text-green-500">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Consultar valor
                            </p>
                          ) : course.price ? (
                            <p className="font-serif text-sm font-bold text-amber-400">
                              {formatBRL(Number(course.price))}
                            </p>
                          ) : (
                            <p className="text-[10px] text-emerald-500 font-semibold">Gratuito</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── CTA para não logados ── */}
      {!session && (
        <section className="border-t border-white/5 bg-[#0a0a0f] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-white">
              Crie sua conta para{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                adquirir os cursos
              </span>
            </h2>
            <p className="mt-4 text-gray-400">
              Faça seu cadastro gratuitamente. Após adquirir um curso, acesse sua área de membro e assista quando quiser.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-semibold text-black shadow-lg transition-all hover:shadow-amber-700/40"
              >
                Criar conta grátis
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-8 py-4 font-medium text-white/80 transition-all hover:border-white/20 hover:text-white"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
