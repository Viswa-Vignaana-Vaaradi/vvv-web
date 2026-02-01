"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";

export const DashboardSidebar = () => {
    const { state, dispatch } = useAuth();

    if (!state) {
        console.log("User not authenticated", state);
        return <p>Please Log In</p>
    }
    console.log("DashboardSidebar user:", state);

    return (
        <Sidebar collapsible="icon" className="top-16 h-[calc(100vh-64px)">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter >
                {state.user?.email}
            </SidebarFooter>
        </Sidebar>
    )
}