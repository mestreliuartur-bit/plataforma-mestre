"use client";

import { useTransition } from "react";
import { deleteCourse } from "./actions";

interface Props {
  courseId: string;
  courseTitle: string;
}

export function DeleteCourseButton({ courseId, courseTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Excluir "${courseTitle}"? Esta ação não pode ser desfeita.`)) return;
    startTransition(() => deleteCourse(courseId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-500/60 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-40"
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
