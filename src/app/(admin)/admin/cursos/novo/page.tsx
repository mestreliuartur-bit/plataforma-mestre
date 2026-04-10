import Link from "next/link";
import { CourseForm } from "../CourseForm";
import { createCourse } from "../actions";

export default function NovoCursoPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin/cursos" className="hover:text-amber-400">Cursos</Link>
          <span>/</span>
          <span className="text-gray-400">Novo</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">Criar Novo Curso</h1>
        <p className="mt-1 text-sm text-gray-500">
          Após criar o curso, você poderá adicionar módulos e aulas.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <CourseForm action={createCourse} submitLabel="Criar Curso e Adicionar Aulas" />
      </div>
    </div>
  );
}
