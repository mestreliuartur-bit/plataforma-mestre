"use client";

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
  modules: Module[];
  totalLessons: number;
  totalDuration: string | null;
  isEnrolled: boolean;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}` : `${m}min`;
}

export function CurriculumSection({ modules, totalLessons, totalDuration, isEnrolled }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(modules.length > 0 ? [modules[0].id] : [])
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (!modules.length) return null;

  return (
    <section className="border-t border-white/5 bg-[#0a0a0f] py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <div className="mb-2 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-bold text-white">O que você vai aprender</h2>
          <button
            type="button"
            onClick={() => {
              const allOpen = modules.every((m) => openIds.has(m.id));
              setOpenIds(allOpen ? new Set() : new Set(modules.map((m) => m.id)));
            }}
            className="text-xs text-amber-400/60 hover:text-amber-400"
          >
            {modules.every((m) => openIds.has(m.id)) ? "Recolher todos" : "Expandir todos"}
          </button>
        </div>
        <p className="mb-10 text-gray-500">
          {modules.length} módulo{modules.length !== 1 ? "s" : ""} · {totalLessons} aula{totalLessons !== 1 ? "s" : ""}
          {totalDuration && ` · ${totalDuration} de conteúdo`}
        </p>

        <div className="space-y-3">
          {modules.map((module, mi) => {
            const isOpen = openIds.has(module.id);
            const moduleDuration = module.lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);

            return (
              <div
                key={module.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-white/10" : "border-white/5"
                } bg-white/[0.02]`}
              >
                <button
                  type="button"
                  onClick={() => toggle(module.id)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5 text-sm font-bold text-amber-400">
                    {mi + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{module.title}</p>
                    <p className="text-xs text-gray-500">
                      {module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}
                      {moduleDuration > 0 && ` · ${formatDuration(moduleDuration)}`}
                    </p>
                  </div>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && module.lessons.length > 0 && (
                  <div className="border-t border-white/5">
                    {module.lessons.map((lesson, li) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 border-b border-white/5 px-6 py-3 last:border-b-0"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                          {isEnrolled ? (
                            <svg className="h-3 w-3 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          ) : (
                            <svg className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          )}
                        </div>
                        <p className={`flex-1 truncate text-sm ${isEnrolled ? "text-gray-300" : "text-gray-500"}`}>
                          {li + 1}. {lesson.title}
                        </p>
                        {lesson.duration && (
                          <span className="flex-shrink-0 text-[10px] text-gray-600">
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
