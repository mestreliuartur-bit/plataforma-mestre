import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { LessonSidebar } from "./LessonSidebar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; lessonId: string }>;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Extrai embed URL normalizada para iframe
function toEmbedUrl(url: string) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Já é embed / outros
  return url;
}

export default async function LessonPlayerPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const session = await auth();

  const course = await db.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
      enrollments: session?.user?.id
        ? { where: { userId: session.user.id } }
        : false,
    },
  });

  if (!course) notFound();

  // Encontrar a aula atual
  const allLessons = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  if (currentIndex === -1) notFound();

  const currentLesson = allLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isEnrolled = (course.enrollments as { userId: string }[]).length > 0;
  const isAdmin = session?.user?.role === "ADMIN";
  const hasAccess = isEnrolled || isAdmin || !course.price;

  // Sem acesso → redireciona para a página de vendas do curso
  if (!hasAccess) {
    redirect(`/cursos/${slug}`);
  }

  const embedUrl = currentLesson.videoUrl ? toEmbedUrl(currentLesson.videoUrl) : null;

  return (
    <div className="flex h-screen flex-col bg-[#080810] overflow-hidden">
      {/* ── Top bar ── */}
      <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-white/5 bg-[#08080e] px-4">
        <Link
          href="/cursos"
          className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden text-sm sm:inline">Cursos</span>
        </Link>

        <div className="mx-2 h-4 w-px bg-white/10" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-gray-500">{course.title}</p>
          <p className="truncate text-sm font-medium text-white">{currentLesson.title}</p>
        </div>

        {/* Navegação rápida */}
        <div className="flex items-center gap-2">
          {prevLesson ? (
            <Link
              href={`/cursos/${slug}/${prevLesson.id}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : (
            <div className="hidden sm:block w-20" />
          )}

          <span className="text-xs text-gray-600">
            {currentIndex + 1}/{allLessons.length}
          </span>

          {nextLesson ? (
            <Link
              href={`/cursos/${slug}/${nextLesson.id}`}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-amber-400"
            >
              <span className="hidden sm:inline">Próxima</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              Concluído!
            </span>
          )}
        </div>
      </header>

      {/* ── Main: Player + Sidebar ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Player */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Vídeo */}
          <div className="w-full bg-black">
            {embedUrl ? (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-gray-950">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="mt-4 text-gray-500">Vídeo ainda não configurado para esta aula</p>
                </div>
              </div>
            )}
          </div>

          {/* Info da aula */}
          <div className="mx-auto w-full max-w-4xl px-6 py-8">
            <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
              <span>{currentLesson.moduleTitle}</span>
              {currentLesson.duration && (
                <>
                  <span>·</span>
                  <span>{formatDuration(currentLesson.duration)} min</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-2xl font-bold text-white lg:text-3xl">
              {currentLesson.title}
            </h1>

            {currentLesson.description && (
              <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Sobre esta aula
                </h2>
                <p className="leading-relaxed text-gray-300 whitespace-pre-line">
                  {currentLesson.description}
                </p>
              </div>
            )}

            {/* Navegação inferior */}
            <div className="mt-8 flex flex-wrap gap-4">
              {prevLesson && (
                <Link
                  href={`/cursos/${slug}/${prevLesson.id}`}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <p className="text-[10px] text-gray-600">Aula Anterior</p>
                    <p className="truncate text-xs max-w-[160px]">{prevLesson.title}</p>
                  </div>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/cursos/${slug}/${nextLesson.id}`}
                  className="ml-auto flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-5 py-3 text-sm text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  <div className="text-right">
                    <p className="text-[10px] text-amber-400/60">Próxima Aula</p>
                    <p className="truncate text-xs max-w-[160px]">{nextLesson.title}</p>
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar de navegação */}
        <LessonSidebar
          courseSlug={slug}
          currentLessonId={lessonId}
          modules={course.modules}
          courseTitle={course.title}
        />
      </div>
    </div>
  );
}
