import Link from "next/link";
import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export default function NovoEventoPage() {
  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <span>/</span>
          <Link href="/admin/eventos" className="hover:text-gray-300">Eventos</Link>
          <span>/</span>
          <span className="text-gray-300">Novo</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Novo Evento / Ritual</h1>
      </div>

      {/* ── Formulário ── */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <EventForm action={createEvent} submitLabel="Criar Evento" />
      </div>

      {/* ── Nota sobre upload de imagem ── */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-2 font-serif text-sm font-semibold text-white">Upload de Imagens</h3>
        <p className="text-sm leading-relaxed text-gray-500">
          Para o campo de imagem de capa, recomendamos integrar o{" "}
          <strong className="text-gray-300">UploadThing</strong> (zero config, ideal para Next.js App Router)
          ou o <strong className="text-gray-300">Cloudinary</strong> (transformações avançadas).
          A integração substitui o campo de URL por um componente de drag-and-drop com
          preview — basta adicionar a dependência <code className="text-amber-400/80">uploadthing</code> e
          configurar a rota <code className="text-amber-400/80">/api/uploadthing</code>.
        </p>
      </div>
    </div>
  );
}
