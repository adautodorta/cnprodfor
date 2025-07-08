import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  let user = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true, email: true, role: true },
    });
  }

  function getInitials(name: string): string {
    const parts = name?.trim().split(/\s+/) ?? [];
    if (parts.length === 1) return parts[0]?.substring(0, 2).toUpperCase();
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return '';
  }

  return (
    <AuthProvider>
        <SidebarProvider>
            <AppSidebar user={user} initialsName={getInitials(user?.name as string)}/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
                    <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="container mx-auto flex items-center justify-center flex-col">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    </AuthProvider>
  );
}