import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CampaignForm } from "../CampaignForm";
import { updateCampaign } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCampanhaPage({ params }: Props) {
  const { id } = await params;
  const campaign = await db.campaignPage.findUnique({ where: { id } });
  if (!campaign) notFound();

  const testimonials = campaign.testimonials
    ? JSON.stringify(campaign.testimonials, null, 2)
    : undefined;

  const action = updateCampaign.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <span>/</span>
          <Link href="/admin/campanhas" className="hover:text-gray-300">Campanhas</Link>
          <span>/</span>
          <span className="text-gray-300">Editar</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Editar Campanha</h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-sm text-gray-500 font-mono">/campanha/{campaign.slug}</p>
          <Link
            href={`/campanha/${campaign.slug}`}
            target="_blank"
            className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
          >
            Ver página →
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
        <CampaignForm
          action={action}
          submitLabel="Salvar Alterações"
          defaultValues={{
            slug: campaign.slug,
            isActive: campaign.isActive,
            headline: campaign.headline,
            subtitle: campaign.subtitle ?? undefined,
            mediaType: campaign.mediaType,
            mediaUrl: campaign.mediaUrl ?? undefined,
            ctaLabel: campaign.ctaLabel,
            ctaUrl: campaign.ctaUrl,
            aboutImage: campaign.aboutImage ?? undefined,
            aboutTitle: campaign.aboutTitle ?? undefined,
            aboutText: campaign.aboutText ?? undefined,
            testimonials,
            metaTitle: campaign.metaTitle ?? undefined,
            metaDescription: campaign.metaDescription ?? undefined,
            pixelHead: campaign.pixelHead ?? undefined,
            pixelBody: campaign.pixelBody ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
