"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";

export const DashboardSidebar = () => {
    const { state } = useAuth();

    if (!state || !state.user) {
        console.log("User not authenticated or user data missing", state);
        return <p>Please Log In</p>
    }
    console.log("DashboardSidebar user:", state);

    return (
        <Sidebar collapsible="icon" className="top-16 h-[calc(100vh-64px)]">
            <SidebarHeader>
                <p>Sidebar Header</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                
                                <span>Home</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter >
                <p>{state.user?.email}</p>
            </SidebarFooter>
        </Sidebar>
    );
};