import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./components/dashboard-sidebar";

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
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}