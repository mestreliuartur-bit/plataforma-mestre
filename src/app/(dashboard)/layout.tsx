import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Dupla verificação além do middleware
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar fixa */}
      <DashboardSidebar
        userName={session.user.name ?? "Usuário"}
        userEmail={session.user.email ?? ""}
        userImage={session.user.image}
      />

      {/* Conteúdo principal com scroll */}
      <main className="flex-1 overflow-y-auto">
        {/* Decoração de fundo */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-purple-900/10 blur-[120px]" />
          <div className="absolute bottom-0 left-64 h-[300px] w-[300px] rounded-full bg-amber-900/8 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
