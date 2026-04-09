import { db } from "@/lib/db";
import { BannerToggle, BannerDeleteButton } from "./BannerActions";
import { BannerForm } from "./BannerForm";

export default async function AdminBannersPage() {
  const [banners, events] = await Promise.all([
    db.banner.findMany({ orderBy: { order: "asc" }, include: { event: { select: { title: true } } } }),
    db.event.findMany({ where: { isPublished: true }, select: { id: true, title: true, slug: true } }),
  ]);

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">Admin</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-white">Banners da Homepage</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie o carrossel Hero da página inicial. {banners.length} banner(s) cadastrado(s).
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Formulário novo banner ── */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-6 font-serif text-lg font-semibold text-white">Adicionar Banner</h2>
          <BannerForm events={events} />
        </div>

        {/* ── Lista de banners ── */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-white">Banners Ativos</h2>

          {banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-sm text-gray-500">Nenhum banner cadastrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                  {/* Preview da imagem */}
                  <div
                    className="h-28 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                  >
                    <div className="h-full w-full bg-black/40 backdrop-blur-[1px]" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
                          <p className="truncate text-sm font-semibold text-white">{banner.title}</p>
                        </div>
                        {banner.subtitle && (
                          <p className="mt-0.5 truncate text-xs text-gray-500">{banner.subtitle}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-400">
                            {banner.ctaLabel}
                          </span>
                          <span className="truncate text-[10px] text-gray-600">{banner.ctaUrl}</span>
                        </div>
                        {banner.event && (
                          <p className="mt-1 text-[10px] text-amber-400/60">
                            Vinculado: {banner.event.title}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-shrink-0 flex-col items-end gap-2">
                        <BannerToggle id={banner.id} isActive={banner.isActive} />
                        <span className="text-[10px] text-gray-600">
                          {banner.isActive ? "Visível" : "Oculto"}
                        </span>
                        <BannerDeleteButton id={banner.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
