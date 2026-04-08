// Polyfill de localStorage para o ambiente Node.js (SSR / Next.js dev server).
// O Next.js 15 dev overlay acessa localStorage durante a renderização no servidor.
// Em produção este código não tem impacto pois o servidor não usa localStorage real.

export async function register() {
  if (typeof window === "undefined") {
    const store: Record<string, string> = {};

    const localStorageMock = {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: string): void => { store[key] = String(value); },
      removeItem: (key: string): void => { delete store[key]; },
      clear: (): void => { Object.keys(store).forEach((k) => delete store[k]); },
      key: (index: number): string | null => Object.keys(store)[index] ?? null,
      get length(): number { return Object.keys(store).length; },
    };

    // Sobrescreve o objeto parcial criado pelo flag --localstorage-file
    // Object.defineProperty garante o override mesmo se a prop for non-configurable
    try {
      Object.defineProperty(globalThis, "localStorage", {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });
    } catch {
      (globalThis as Record<string, unknown>)["localStorage"] = localStorageMock;
    }
  }
}
