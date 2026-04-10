import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Meus Cursos" };

export default async function MeusCursosPage() {
  const session = await auth();

  const enrollments = await db.userEnrollment.findMany({
    where: { userId: session!.user.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: { orderBy: { order: "asc" }, take: 1 },
            },
          },
          _count: { select: { modules: true, enrollments: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
          Área de Membros
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Meus Cursos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Todos os cursos e treinamentos que você adquiriu.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5">
            <svg className="h-8 w-8 text-amber-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.63 48.63 0 0112 20.904a48.63 48.63 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-400">Nenhum curso adquirido</p>
          <p className="mt-1 text-sm text-gray-600">
            Explore o catálogo e comece sua jornada de aprendizado.
          </p>
          <Link
            href="/cursos"
            className="mt-6 rounded-full border border-amber-400/30 px-6 py-2.5 text-sm font-medium text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/5"
          >
            Ver Cursos Disponíveis
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map(({ course }) => {
            const firstLesson = course.modules[0]?.lessons[0];
            const totalModules = course._count.modules;

            return (
              <div
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-amber-400/20 hover:bg-white/[0.04]"
              >
                {/* Capa */}
                <div className="relative aspect-[9/16] max-h-48 w-full overflow-hidden bg-gradient-to-br from-purple-950 to-gray-900">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        course.coverImage.startsWith("http")
                          ? course.coverImage
                          : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_9:16,q_auto,f_auto/${course.coverImage}`
                      }
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-12 w-12 text-amber-400/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.63 48.63 0 0112 20.904a48.63 48.63 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                    </div>
                  )}

                  {/* Badge adquirido */}
                  <div className="absolute left-3 top-3 rounded-full border border-emerald-500/30 bg-emerald-900/60 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
                    Adquirido
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-gray-600">{totalModules} módulo{totalModules !== 1 ? "s" : ""}</p>
                  <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-white">
                    {course.title}
                  </h3>

                  <div className="mt-auto pt-4">
                    {firstLesson ? (
                      <Link
                        href={`/cursos/${course.slug}/${firstLesson.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                        Continuar Assistindo
                      </Link>
                    ) : (
                      <span className="flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-500">
                        Sem aulas disponíveis
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
