"use client";

import { useState, useTransition } from "react";
import { createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson } from "../../actions";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
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
  courseId: string;
  initialModules: Module[];
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ModuloManager({ courseId, initialModules }: Props) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(initialModules.map(m => m.id)));
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [showNewModule, setShowNewModule] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputClass = "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition focus:border-amber-400/40";

  function toggleModule(id: string) {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Módulos ──────────────────────────────────────────────

  function handleCreateModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", newModuleTitle);
    startTransition(async () => {
      await createModule(courseId, formData);
      setNewModuleTitle("");
      setShowNewModule(false);
      window.location.reload();
    });
  }

  function handleUpdateModule(moduleId: string, title: string) {
    const formData = new FormData();
    formData.set("title", title);
    startTransition(async () => {
      await updateModule(moduleId, courseId, formData);
      setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m));
      setEditingModule(null);
    });
  }

  function handleDeleteModule(moduleId: string) {
    if (!confirm("Excluir este módulo e todas as aulas?")) return;
    startTransition(async () => {
      await deleteModule(moduleId, courseId);
      setModules(prev => prev.filter(m => m.id !== moduleId));
    });
  }

  // ── Aulas ─────────────────────────────────────────────────

  function handleCreateLesson(moduleId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createLesson(moduleId, courseId, fd);
      setAddingLesson(null);
      window.location.reload();
    });
  }

  function handleUpdateLesson(lessonId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateLesson(lessonId, courseId, fd);
      setEditingLesson(null);
      window.location.reload();
    });
  }

  function handleDeleteLesson(lessonId: string, moduleId: string) {
    if (!confirm("Excluir esta aula?")) return;
    startTransition(async () => {
      await deleteLesson(lessonId, courseId);
      setModules(prev =>
        prev.map(m => m.id === moduleId
          ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
          : m
        )
      );
    });
  }

  return (
    <div className="space-y-4">
      {/* Lista de módulos */}
      {modules.map((module, mi) => (
        <div key={module.id} className="rounded-2xl border border-white/5 bg-white/[0.02]">
          {/* Header do módulo */}
          <div className="flex items-center gap-3 px-5 py-4">
            <button
              onClick={() => toggleModule(module.id)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:text-white"
            >
              <svg
                className={`h-4 w-4 transition-transform ${expandedModules.has(module.id) ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/5 text-xs font-bold text-amber-400">
              {mi + 1}
            </div>

            {editingModule === module.id ? (
              <form
                className="flex flex-1 items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.elements.namedItem("title") as HTMLInputElement);
                  handleUpdateModule(module.id, input.value);
                }}
              >
                <input
                  name="title"
                  defaultValue={module.title}
                  autoFocus
                  className="flex-1 rounded-lg border border-amber-400/30 bg-white/[0.04] px-3 py-1.5 text-sm text-white outline-none"
                />
                <button type="submit" disabled={isPending} className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/30">
                  Salvar
                </button>
                <button type="button" onClick={() => setEditingModule(null)} className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:text-white">
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <span className="flex-1 font-medium text-white">{module.title}</span>
                <span className="text-xs text-gray-600">{module.lessons.length} aula{module.lessons.length !== 1 ? "s" : ""}</span>
                <button onClick={() => setEditingModule(module.id)} className="rounded-lg p-1.5 text-gray-500 transition-colors hover:text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>
                <button onClick={() => handleDeleteModule(module.id)} className="rounded-lg p-1.5 text-gray-600 transition-colors hover:text-red-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Aulas */}
          {expandedModules.has(module.id) && (
            <div className="border-t border-white/5">
              {module.lessons.length === 0 && addingLesson !== module.id && (
                <p className="px-6 py-4 text-sm text-gray-600">Nenhuma aula ainda.</p>
              )}

              {module.lessons.map((lesson, li) => (
                <div key={lesson.id} className="border-b border-white/5 px-6 py-3">
                  {editingLesson === lesson.id ? (
                    <form onSubmit={(e) => handleUpdateLesson(lesson.id, e)} className="space-y-3">
                      <input name="title" defaultValue={lesson.title} placeholder="Título da aula" required className={inputClass} />
                      <textarea name="description" defaultValue={lesson.description ?? ""} placeholder="Descrição (opcional)" rows={2} className={`${inputClass} resize-none`} />
                      <input name="videoUrl" defaultValue={lesson.videoUrl ?? ""} placeholder="URL do vídeo embed (YouTube, Vimeo, Panda...)" className={inputClass} />
                      <input name="duration" type="number" defaultValue={lesson.duration ?? ""} placeholder="Duração em segundos (ex: 600 = 10min)" className={inputClass} />
                      <div className="flex gap-2">
                        <button type="submit" disabled={isPending} className="rounded-lg bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/30">Salvar</button>
                        <button type="button" onClick={() => setEditingLesson(null)} className="rounded-lg px-4 py-2 text-xs text-gray-500 hover:text-white">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] text-gray-500">
                        {li + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-xs text-gray-600">{formatDuration(lesson.duration)}</p>
                        )}
                      </div>
                      {lesson.videoUrl && (
                        <svg className="h-4 w-4 flex-shrink-0 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                      )}
                      <button onClick={() => setEditingLesson(lesson.id)} className="rounded p-1 text-gray-600 hover:text-white">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteLesson(lesson.id, module.id)} className="rounded p-1 text-gray-600 hover:text-red-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Form nova aula */}
              {addingLesson === module.id ? (
                <form onSubmit={(e) => handleCreateLesson(module.id, e)} className="space-y-3 px-6 py-4">
                  <input name="title" placeholder="Título da aula *" required autoFocus className={inputClass} />
                  <textarea name="description" placeholder="Descrição (opcional)" rows={2} className={`${inputClass} resize-none`} />
                  <input name="videoUrl" placeholder="URL do vídeo embed (YouTube, Vimeo, Panda...)" className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="duration" type="number" placeholder="Duração em segundos" className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isPending} className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400">
                      {isPending ? "Salvando..." : "Adicionar Aula"}
                    </button>
                    <button type="button" onClick={() => setAddingLesson(null)} className="rounded-lg border border-white/10 px-4 py-2 text-xs text-gray-400 hover:text-white">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-6 py-3">
                  <button
                    onClick={() => setAddingLesson(module.id)}
                    className="flex items-center gap-1.5 text-xs text-amber-400/70 transition-colors hover:text-amber-400"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Adicionar aula
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Novo módulo */}
      {showNewModule ? (
        <form onSubmit={handleCreateModule} className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-5 py-4">
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Nome do módulo *"
            required
            autoFocus
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-amber-400/40"
          />
          <button type="submit" disabled={isPending} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
            {isPending ? "..." : "Criar"}
          </button>
          <button type="button" onClick={() => setShowNewModule(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white">
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowNewModule(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-5 text-sm font-medium text-gray-500 transition-all hover:border-amber-400/30 hover:text-amber-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Módulo
        </button>
      )}
    </div>
  );
}
