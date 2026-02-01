import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
            throw: true,
        },
    });
    
    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <AuthProvider initialSession={session}>
        <SidebarProvider>
            <Sidebar collapsible="icon" className="top-16 h-[calc(100vh-64px)" />
            <main className="flex-1 overflow-y-auto">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
        </AuthProvider>
    )
}