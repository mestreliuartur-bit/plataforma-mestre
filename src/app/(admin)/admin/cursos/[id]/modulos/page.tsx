import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ModuloManager } from "./ModuloManager";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ModulosPage({ params }: Props) {
  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) notFound();

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin/cursos" className="hover:text-amber-400">Cursos</Link>
          <span>/</span>
          <Link href={`/admin/cursos/${id}/editar`} className="hover:text-amber-400 truncate max-w-[200px]">{course.title}</Link>
          <span>/</span>
          <span className="text-gray-400">Módulos & Aulas</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">{course.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {course.modules.length} módulo{course.modules.length !== 1 ? "s" : ""} · {totalLessons} aula{totalLessons !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/cursos/${id}/editar`}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Editar Curso
            </Link>
            {course.isPublished && (
              <Link
                href={`/cursos/${course.slug}`}
                target="_blank"
                className="rounded-xl border border-amber-400/30 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:border-amber-400/60"
              >
                Ver Curso →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dica */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-blue-300/80">
          Organize o conteúdo em módulos. Dentro de cada módulo, adicione as aulas com título, descrição e URL do vídeo embed.
          A URL pode ser do YouTube, Vimeo, Panda Video ou qualquer serviço que forneça embed iframe.
        </p>
      </div>

      {/* Manager interativo */}
      <ModuloManager courseId={id} initialModules={course.modules} />
    </div>
  );
}
