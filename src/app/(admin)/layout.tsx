import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Dupla verificação além do middleware
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <AdminSidebar
        userName={session.user.name ?? "Admin"}
        userEmail={session.user.email ?? ""}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Decoração de fundo sutil */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-amber-900/5 blur-[150px]" />
          <div className="absolute bottom-0 left-64 h-[300px] w-[300px] rounded-full bg-purple-900/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
