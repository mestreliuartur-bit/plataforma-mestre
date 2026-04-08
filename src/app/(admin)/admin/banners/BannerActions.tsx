"use client";

import { useTransition } from "react";
import { toggleBanner, deleteBanner } from "./actions";

export function BannerToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleBanner(id, !isActive))}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
        isActive ? "bg-amber-500" : "bg-gray-700"
      }`}
    >
      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
        isActive ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );
}

export function BannerDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Remover este banner?")) return;
    startTransition(() => deleteBanner(id));
  }

  return (
    <button
      disabled={isPending}
      onClick={handleDelete}
      className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
    >
      {isPending ? "..." : "Remover"}
    </button>
  );
}
