import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseForm } from "../../CourseForm";
import { updateCourse } from "../../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCursoPage({ params }: Props) {
  const { id } = await params;
  const course = await db.course.findUnique({ where: { id } });
  if (!course) notFound();

  const action = updateCourse.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin/cursos" className="hover:text-amber-400">Cursos</Link>
          <span>/</span>
          <span className="text-gray-400">Editar</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">{course.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Link
            href={`/admin/cursos/${id}/modulos`}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            → Gerenciar Módulos & Aulas
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <CourseForm
          action={action}
          submitLabel="Salvar Alterações"
          defaultValues={{
            title: course.title,
            slug: course.slug,
            description: course.description,
            coverImage: course.coverImage ?? "",
            bannerImage: course.bannerImage ?? "",
            category: course.category,
            isPublished: course.isPublished,
            price: course.price?.toString() ?? "",
            isWhatsappLead: course.isWhatsappLead,
            whatsappNumber: course.whatsappNumber ?? "",
          }}
        />
      </div>
    </div>
  );
}
