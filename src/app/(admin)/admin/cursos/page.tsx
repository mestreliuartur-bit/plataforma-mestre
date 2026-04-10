import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteCourseButton } from "./DeleteCourseButton";

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

export default async function AdminCursosPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { modules: true, enrollments: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-400/60">LMS</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white">Cursos & Mentorias</h1>
          <p className="mt-1 text-sm text-gray-500">{courses.length} curso{courses.length !== 1 ? "s" : ""} cadastrado{courses.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Curso
        </Link>
      </div>

      {/* Lista */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
            <svg className="h-8 w-8 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.63 48.63 0 0112 20.904a48.63 48.63 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <p className="text-gray-400">Nenhum curso criado ainda</p>
          <Link href="/admin/cursos/novo" className="mt-4 text-sm text-amber-400 hover:text-amber-300">
            Criar primeiro curso →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="divide-y divide-white/5">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 px-6 py-4">
                {/* Miniatura */}
                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-950 to-gray-900">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.coverImage.startsWith("http") ? course.coverImage : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_9:16,q_auto,f_auto/${course.coverImage}`}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-5 w-5 text-amber-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-white">{course.title}</p>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      course.isPublished
                        ? "bg-emerald-900/50 text-emerald-400"
                        : "bg-gray-800 text-gray-500"
                    }`}>
                      {course.isPublished ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    <span>{CATEGORY_LABELS[course.category] ?? course.category}</span>
                    <span>{course._count.modules} módulo{course._count.modules !== 1 ? "s" : ""}</span>
                    <span>{course._count.enrollments} aluno{course._count.enrollments !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/cursos/${course.id}/modulos`}
                    className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-500/20"
                  >
                    Módulos & Aulas
                  </Link>
                  <Link
                    href={`/admin/cursos/${course.id}/editar`}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-white"
                  >
                    Editar
                  </Link>
                  <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
