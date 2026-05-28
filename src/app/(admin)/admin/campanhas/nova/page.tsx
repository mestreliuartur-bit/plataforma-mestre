import Link from "next/link";
import { CampaignForm } from "../CampaignForm";
import { createCampaign } from "../actions";

export default function NovaCampanhaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <span>/</span>
          <Link href="/admin/campanhas" className="hover:text-gray-300">Campanhas</Link>
          <span>/</span>
          <span className="text-gray-300">Nova</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Nova Campanha</h1>
        <p className="mt-1 text-sm text-gray-500">
          Crie uma squeeze page isolada para receber tráfego pago.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <CampaignForm action={createCampaign} submitLabel="Criar Campanha" />
      </div>
    </div>
  );
}
