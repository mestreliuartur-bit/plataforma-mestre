import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug }, select: { title: true, description: true } });
  if (!course) return {};
  return { title: course.title, description: course.description.slice(0, 160) };
}

const CATEGORY_LABELS: Record<string, string> = {
  UMBANDA: "Umbanda", MAGIA: "Magia", ESPIRITUALIDADE: "Espiritualidade",
  RITUAIS: "Rituais", MEDITACAO: "Meditação", ASTROLOGIA: "Astrologia",
  TAROT: "Tarot", OUTROS: "Outros",
};

const formatBRL = (v: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}` : `${m}min`;
}

export default async function CourseSalesPage({ params }: Props) {
  const { slug } = await params;

  const [course, session] = await Promise.all([
    db.course.findUnique({
      where: { slug, isPublished: true },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, duration: true, order: true },
            },
          },
        },
      },
    }),
    auth(),
  ]);

  if (!course) notFound();

  // Checar se o usuário já está matriculado
  let isEnrolled = false;
  let firstLessonId: string | null = null;

  if (session?.user?.id) {
    const enrollment = await db.userEnrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });
    isEnrolled = !!enrollment;
  }

  // Admins têm acesso total
  if (session?.user?.role === "ADMIN") isEnrolled = true;

  // Primeira aula para o botão "Continuar"
  for (const m of course.modules) {
    if (m.lessons.length > 0) { firstLessonId = m.lessons[0].id; break; }
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + (l.duration ?? 0), 0), 0
  );

  const coverUrl = course.coverImage
    ? course.coverImage.startsWith("http")
      ? course.coverImage
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_9:16,w_800,q_auto,f_auto/${course.coverImage}`
    : null;

  const whatsappUrl = course.isWhatsappLead && course.whatsappNumber
    ? `https://wa.me/${course.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Tenho interesse no curso: ${course.title}`)}`
    : `https://wa.me/5511910998013?text=${encodeURIComponent(`Olá! Tenho interesse no curso: ${course.title}`)}`;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Fundo blur */}
        {coverUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${coverUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/30" />
        <div className="pointer-events-none absolute right-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-900/15 blur-[100px]" />

        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-24 lg:px-12">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_300px] lg:items-center xl:grid-cols-[1fr_340px]">

            {/* Imagem mobile */}
            {coverUrl && (
              <div className="flex justify-center lg:hidden">
                <div className="relative w-full max-w-[200px]">
                  <div className="absolute -inset-2 rounded-2xl bg-purple-400/10 blur-xl" />
                  <img
                    src={coverUrl}
                    alt={course.title}
                    className="relative w-full rounded-xl object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10"
                    style={{ aspectRatio: "9/16" }}
                  />
                </div>
              </div>
            )}

            {/* Coluna esquerda */}
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center gap-2 text-xs text-gray-600">
                <Link href="/" className="hover:text-gray-400">Início</Link>
                <span>/</span>
                <Link href="/cursos" className="hover:text-gray-400">Cursos</Link>
                <span>/</span>
                <span className="text-gray-400">{course.title}</span>
              </nav>

              {/* Badges */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-900/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                  {CATEGORY_LABELS[course.category] ?? course.category}
                </span>
                {isEnrolled && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-bold text-emerald-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Adquirido
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              {/* Descrição */}
              <p className="mt-6 text-lg leading-relaxed text-gray-400">
                {course.description.split("\n")[0]}
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap gap-5">
                {[
                  { label: "Módulos", value: String(course.modules.length) },
                  { label: "Aulas", value: String(totalLessons) },
                  ...(totalDuration > 0 ? [{ label: "Duração total", value: formatDuration(totalDuration) ?? "" }] : []),
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="font-serif font-bold text-white">{s.value}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* ── CTA PRINCIPAL ── */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {isEnrolled ? (
                  <>
                    <Link
                      href={firstLessonId ? `/cursos/${slug}/${firstLessonId}` : `/dashboard/cursos`}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/50 hover:shadow-xl"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      Acessar Curso
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>
                    <Link href="/dashboard/cursos" className="text-sm text-gray-500 hover:text-gray-300">
                      Ver todos os meus cursos →
                    </Link>
                  </>
                ) : course.isWhatsappLead ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:shadow-green-700/50 hover:shadow-xl"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Quero este curso — Falar no WhatsApp
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                  </a>
                ) : (
                  <>
                    <Link
                      href={session ? `/login?callbackUrl=/cursos/${slug}` : `/login?callbackUrl=/cursos/${slug}`}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-amber-900/30 transition-all hover:shadow-amber-700/50 hover:shadow-xl"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      {session ? "Comprar Agora" : "Entrar para Comprar"}
                      {course.price && (
                        <span className="rounded-full bg-black/20 px-3 py-0.5 text-sm font-bold">
                          {formatBRL(Number(course.price))}
                        </span>
                      )}
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>
                    {!session && (
                      <p className="text-xs text-gray-600">
                        Não tem conta?{" "}
                        <Link href={`/register?callbackUrl=/cursos/${slug}`} className="text-amber-400/80 hover:text-amber-400">
                          Criar grátis →
                        </Link>
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Garantia */}
              <div className="mt-6 flex items-center gap-3 text-xs text-gray-600">
                <svg className="h-4 w-4 flex-shrink-0 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>Acesso vitalício após a compra · Suporte direto com o Mestre</span>
              </div>
            </div>

            {/* Coluna direita — imagem desktop */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-purple-400/10 blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60" style={{ width: 260, height: 462 }}>
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-950 via-zinc-900 to-zinc-950">
                      <svg viewBox="0 0 100 100" className="h-20 w-20 text-purple-800/40" fill="currentColor">
                        <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  {course.price && !isEnrolled && !course.isWhatsappLead && (
                    <div className="absolute bottom-3 inset-x-3 rounded-xl bg-black/70 px-4 py-3 text-center backdrop-blur-sm">
                      <p className="text-xs text-gray-400">Investimento</p>
                      <p className="font-serif text-xl font-bold text-amber-400">{formatBRL(Number(course.price))}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conteúdo Programático ── */}
      {course.modules.length > 0 && (
        <section className="border-t border-white/5 bg-[#0a0a0f] py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <h2 className="mb-2 font-serif text-3xl font-bold text-white">O que você vai aprender</h2>
            <p className="mb-10 text-gray-500">
              {course.modules.length} módulo{course.modules.length !== 1 ? "s" : ""} · {totalLessons} aula{totalLessons !== 1 ? "s" : ""}
              {totalDuration > 0 && ` · ${formatDuration(totalDuration)} de conteúdo`}
            </p>

            <div className="space-y-3">
              {course.modules.map((module, mi) => (
                <div key={module.id} className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                  {/* Header do módulo */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5 text-sm font-bold text-amber-400">
                      {mi + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{module.title}</p>
                      <p className="text-xs text-gray-500">{module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Lista de aulas (sem links — apenas preview) */}
                  {module.lessons.length > 0 && (
                    <div className="border-t border-white/5">
                      {module.lessons.map((lesson, li) => (
                        <div key={lesson.id} className="flex items-center gap-3 border-b border-white/5 px-6 py-3 last:border-b-0">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] text-gray-500">
                            {isEnrolled ? (
                              <svg className="h-3 w-3 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                            ) : (
                              <svg className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            )}
                          </div>
                          <p className={`flex-1 truncate text-sm ${isEnrolled ? "text-gray-300" : "text-gray-500"}`}>
                            {li + 1}. {lesson.title}
                          </p>
                          {lesson.duration && (
                            <span className="flex-shrink-0 text-[10px] text-gray-600">
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      {!isEnrolled && (
        <section className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-white">
              Pronto para começar?
            </h2>
            <p className="mt-4 text-gray-400">
              Adquira o curso, acesse sua área de membro e transforme seu conhecimento espiritual.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {course.isWhatsappLead ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-500"
                >
                  Falar no WhatsApp
                </a>
              ) : (
                <Link
                  href={session ? `/login?callbackUrl=/cursos/${slug}` : `/login?callbackUrl=/cursos/${slug}`}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 font-semibold text-black"
                >
                  {session ? "Comprar Agora" : "Entrar para Comprar"}
                  {course.price && ` — ${formatBRL(Number(course.price))}`}
                </Link>
              )}
              <Link href="/cursos" className="rounded-full border border-white/10 px-8 py-4 font-medium text-white/80 hover:text-white">
                ← Ver todos os cursos
              </Link>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
