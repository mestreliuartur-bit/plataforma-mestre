"use client";

import Link from "next/link";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Props {
  courseSlug: string;
  currentLessonId: string;
  modules: Module[];
  courseTitle: string;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LessonSidebar({ courseSlug, currentLessonId, modules, courseTitle }: Props) {
  const [open, setOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(
      modules
        .filter((m) => m.lessons.some((l) => l.id === currentLessonId))
        .map((m) => m.id)
    )
  );

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  // Para simplificar, consideramos a aula atual como "assistida" apenas para UI
  const currentIndex = modules
    .flatMap((m) => m.lessons)
    .findIndex((l) => l.id === currentLessonId);

  return (
    <>
      {/* Toggle button — visível quando sidebar fechada */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-40 -translate-y-1/2 flex flex-col items-center gap-1 rounded-l-xl border border-r-0 border-white/10 bg-[#0d0d1a] px-2 py-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Abrir conteúdo"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[9px] uppercase tracking-widest [writing-mode:vertical-rl]">Conteúdo</span>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={[
          "flex h-full flex-col border-l border-white/5 bg-[#0a0a10] transition-all duration-300",
          open ? "w-80 flex-shrink-0" : "w-0 overflow-hidden",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-500">{courseTitle}</p>
            <p className="text-xs text-amber-400/70">
              Aula {currentIndex + 1} de {totalLessons}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-2 flex-shrink-0 rounded-lg p-1.5 text-gray-500 hover:text-white transition-colors"
            aria-label="Fechar sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Lista de módulos e aulas */}
        <nav className="flex-1 overflow-y-auto">
          {modules.map((module, mi) => (
            <div key={module.id} className="border-b border-white/5">
              {/* Cabeçalho do módulo */}
              <button
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
              >
                <svg
                  className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform ${
                    expandedModules.has(module.id) ? "rotate-90" : ""
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Módulo {mi + 1}
                  </p>
                  <p className="truncate text-xs font-medium text-gray-300">{module.title}</p>
                </div>
                <span className="flex-shrink-0 text-[10px] text-gray-600">
                  {module.lessons.length}
                </span>
              </button>

              {/* Aulas */}
              {expandedModules.has(module.id) && (
                <div className="pb-2">
                  {module.lessons.map((lesson, li) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isPast = li < currentIndex - (mi > 0 ? 0 : 0); // simplificado
                    return (
                      <Link
                        key={lesson.id}
                        href={`/cursos/${courseSlug}/${lesson.id}`}
                        className={[
                          "flex items-center gap-3 px-4 py-2.5 transition-colors",
                          isCurrent
                            ? "bg-amber-400/10 border-r-2 border-amber-400"
                            : "hover:bg-white/[0.02]",
                        ].join(" ")}
                      >
                        {/* Ícone de status */}
                        <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          isCurrent
                            ? "bg-amber-400 text-black"
                            : isPast
                            ? "bg-emerald-600/30 text-emerald-400"
                            : "bg-white/5 text-gray-600"
                        }`}>
                          {isCurrent ? (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          ) : li + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-xs leading-tight ${isCurrent ? "font-semibold text-amber-200" : "text-gray-400"}`}>
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p className="text-[10px] text-gray-600">{formatDuration(lesson.duration)}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Progress bar */}
        <div className="border-t border-white/5 px-4 py-3">
          <div className="mb-1.5 flex justify-between text-[10px] text-gray-600">
            <span>Progresso</span>
            <span>{currentIndex + 1}/{totalLessons}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
              style={{ width: `${((currentIndex + 1) / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
