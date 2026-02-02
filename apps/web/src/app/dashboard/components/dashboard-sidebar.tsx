"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";

export const DashboardSidebar = () => {
    const { state: authState } = useAuth();
    const { state: sidebarState } = useSidebar();

    if (!authState || !authState.user) {
        console.log("User not authenticated or user data missing", authState);
        return <p>Please Log In</p>
    }
    console.log("DashboardSidebar user:", authState);

    const isCollapsed = sidebarState === "collapsed";

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="top-16 h-[calc(100vh-64px)] bg-[#FFFFFF]">
            <SidebarHeader>
                {!isCollapsed && (
                    <p className="flex items-center justify-center font-poppins font-bold size-8.75 leading-8.25 text-[#FF9B00] ml-20 mt-6 whitespace-nowrap">
                        {"Hi "}{authState.user.name}{" !"}
                    </p>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <span>Profile</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="relative">
                <p>{authState.user?.email}</p>
            </SidebarFooter>
        </Sidebar>
    );
};