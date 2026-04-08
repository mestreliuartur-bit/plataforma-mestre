import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { EventForm } from "../../EventForm";
import { updateEvent } from "../../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarEventoPage({ params }: Props) {
  const { id } = await params;

  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  const action = updateEvent.bind(null, id);

  const defaultValues = {
    title: event.title,
    slug: event.slug,
    description: event.description,
    price: String(event.price),
    coverImage: event.coverImage ?? "",
    type: event.type,
    isActive: event.isActive,
    isPublished: event.isPublished,
    maxSlots: event.maxSlots ? String(event.maxSlots) : undefined,
    eventDate: event.eventDate
      ? event.eventDate.toISOString().slice(0, 16)
      : undefined,
    location: event.location ?? undefined,
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <span>/</span>
          <Link href="/admin/eventos" className="hover:text-gray-300">Eventos</Link>
          <span>/</span>
          <span className="text-gray-300">Editar</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Editar Evento</h1>
        <p className="mt-1 text-sm text-gray-500">{event.title}</p>
      </div>

      {/* ── Formulário ── */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <EventForm
          action={action}
          defaultValues={defaultValues}
          submitLabel="Salvar Alterações"
        />
      </div>
    </div>
  );
}
