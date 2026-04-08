import { db } from "@/lib/db";
import { createBanner } from "./actions";
import { BannerToggle, BannerDeleteButton } from "./BannerActions";

export default async function AdminBannersPage() {
  const [banners, events] = await Promise.all([
    db.banner.findMany({ orderBy: { order: "asc" }, include: { event: { select: { title: true } } } }),
    db.event.findMany({ where: { isPublished: true }, select: { id: true, title: true, slug: true } }),
  ]);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400";

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
          <form action={createBanner} className="space-y-4">
            <div>
              <label className={labelClass}>Título *</label>
              <input name="title" type="text" required placeholder="Ritual de Prosperidade" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subtítulo</label>
              <input name="subtitle" type="text" placeholder="Descrição curta para o hero" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL da Imagem *</label>
              <input name="imageUrl" type="url" required placeholder="https://..." className={inputClass} />
              <p className="mt-1 text-[11px] text-gray-600">Resolução recomendada: 1600×700px</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Texto do Botão *</label>
                <input name="ctaLabel" type="text" required defaultValue="Conhecer Ritual" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>URL de Destino *</label>
                <input name="ctaUrl" type="text" required placeholder="/eventos/meu-evento" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Vincular Evento</label>
                <select name="eventId" className={inputClass}>
                  <option value="">Nenhum (URL manual)</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Ordem</label>
                <input name="order" type="number" min="0" defaultValue="0" className={inputClass} />
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-900/30"
            >
              Adicionar Banner
            </button>
          </form>
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
