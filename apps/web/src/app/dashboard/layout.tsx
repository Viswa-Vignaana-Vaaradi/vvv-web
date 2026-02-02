import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <div className="flex min-h-svh">
                <main className="flex-1 overflow-y-auto">
                    <SidebarTrigger />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}