import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

// Redireciona /cursos/[slug] para a primeira aula do curso
export default async function CourseIndexPage({ params }: Props) {
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" }, take: 1 },
        },
      },
    },
  });

  if (!course) notFound();

  // Encontrar a primeira aula
  for (const module of course.modules) {
    if (module.lessons.length > 0) {
      redirect(`/cursos/${slug}/${module.lessons[0].id}`);
    }
  }

  // Nenhuma aula ainda
  notFound();
}
