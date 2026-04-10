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
    id: "mock-1", slug: "fundamentos-de-umbanda", title: "Fundamentos de Umbanda",
    description: "Aprenda os pilares da Umbanda: Orixás, guias, linhas de trabalho e a ética espiritual que norteia a prática.",
    coverImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=711&fit=crop",
    category: "UMBANDA",
    isPublished: true, price: null, isWhatsappLead: false,
    _count: { modules: 6, enrollments: 234 },
    enrollments: [] as { userId: string }[],
  },
  {
    id: "mock-2", slug: "magia-branca-pratica", title: "Magia Branca Prática",
    description: "Rituais de proteção, cura e prosperidade com ingredientes naturais e intenção elevada.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop",
    category: "MAGIA",
    isPublished: true, price: null, isWhatsappLead: true,
    _count: { modules: 8, enrollments: 189 },
    enrollments: [] as { userId: string }[],
  },
  {
    id: "mock-3", slug: "meditacao-e-chakras", title: "Meditação & Chakras",
    description: "Desbloqueie seus centros energéticos e eleve sua vibração com técnicas de meditação profunda.",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=711&fit=crop",
    category: "MEDITACAO",
    isPublished: true, price: null, isWhatsappLead: true,
    _count: { modules: 5, enrollments: 312 },
    enrollments: [] as { userId: string }[],
  },
  {
    id: "mock-4", slug: "tarot-dos-orixas", title: "Tarot dos Orixás",
    description: "Aprenda a leitura do Tarot com a linguagem e arquétipos dos Orixás africanos.",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=711&fit=crop",
    category: "TAROT",
    isPublished: true, price: null, isWhatsappLead: true,
    _count: { modules: 4, enrollments: 156 },
    enrollments: [] as { userId: string }[],
  },
];

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

  // Agrupar por categoria
  const byCategory = courses.reduce<Record<string, typeof courses>>((acc, c) => {
    const cat = c.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  const categories = Object.keys(byCategory);

  function isEnrolled(course: { enrollments: { userId: string }[] }) {
    if (!userId) return false;
    return course.enrollments.some((e) => e.userId === userId);
  }

  return (
    <main className="min-h-screen bg-[#080810]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0d1a] to-[#080810] py-24">
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-900/10 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/70">
            Área de Membros
          </p>
          <h1 className="font-serif text-5xl font-bold text-white lg:text-6xl">
            Cursos &{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Mentorias
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-400">
            Conhecimento ancestral em formato digital. Aprenda no seu ritmo com o Mestre Liu Artur.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.63 48.63 0 0112 20.904a48.63 48.63 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              {courses.length} curso{courses.length !== 1 ? "s" : ""}
            </span>
            <span>·</span>
            <span>Acesso vitalício</span>
            <span>·</span>
            <span>Certificado de conclusão</span>
          </div>
        </div>
      </section>

      {/* ── Carrosséis por categoria ── */}
      <div className="mx-auto max-w-7xl space-y-16 px-6 py-12 lg:px-12">
        {categories.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            Nenhum curso disponível no momento. Volte em breve.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category}>
              {/* Título da categoria */}
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold text-white">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-xs text-gray-600">
                  {byCategory[category].length} curso{byCategory[category].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Grid de cards 9:16 */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {byCategory[category].map((course) => {
                  const enrolled = isEnrolled(course as { enrollments: { userId: string }[] });
                  const isPremium = !enrolled && (course.price || course.isWhatsappLead);

                  return (
                    <Link
                      key={course.id}
                      href={enrolled
                        ? `/cursos/${course.slug}`
                        : (course.isWhatsappLead
                          ? `https://wa.me/5511910998013?text=Tenho interesse no curso: ${encodeURIComponent(course.title)}`
                          : `/cursos/${course.slug}`
                        )
                      }
                      target={course.isWhatsappLead && !enrolled ? "_blank" : undefined}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-900/10"
                    >
                      {/* Capa 9:16 */}
                      <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
                        {course.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.coverImage.startsWith("http")
                              ? course.coverImage
                              : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_9:16,q_auto,f_auto/${course.coverImage}`}
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

                        {/* Overlay gradiente */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                        {/* Badge cadeado / enrolled */}
                        <div className="absolute right-2 top-2">
                          {enrolled ? (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Meu curso
                            </span>
                          ) : isPremium ? (
                            <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-sm border border-amber-400/30">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                              Premium
                            </span>
                          ) : null}
                        </div>

                        {/* Play icon no hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm">
                            <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </div>
                        </div>

                        {/* Módulos count */}
                        <div className="absolute bottom-2 left-2">
                          <span className="text-[10px] text-gray-300/70">
                            {course._count.modules} módulo{course._count.modules !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Título */}
                      <div className="p-3">
                        <h3 className="text-xs font-semibold leading-tight text-white line-clamp-2 group-hover:text-amber-200 transition-colors">
                          {course.title}
                        </h3>
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
                acessar os cursos
              </span>
            </h2>
            <p className="mt-4 text-gray-400">
              Faça seu cadastro e tenha acesso à área de membros com conteúdo exclusivo do Mestre Liu Artur.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-semibold text-black shadow-lg transition-all hover:shadow-amber-700/40"
              >
                Criar minha conta
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
