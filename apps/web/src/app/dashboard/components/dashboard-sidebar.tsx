"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";
import { HugeiconsIcon } from "@hugeicons/react";
import { AccountSettingIcon, Person, Profile, RupeeCircleIcon } from "@hugeicons/core-free-icons";

export const DashboardSidebar = () => {
    const { state: authState } = useAuth();
    const { state: sidebarState } = useSidebar();

    if (!authState || !authState.user) {
        console.log("User not authenticated or user data missing", authState);
        return <p>Please Log In</p>
    }

    const isCollapsed = sidebarState === "collapsed";

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="top-16 bg-white">
            <SidebarHeader>
                {!isCollapsed && (
                    <p className="flex items-center justify-center font-poppins font-bold text-2xl leading-tight text-[#FF9B00] whitespace-nowrap">
                        {"Hi "}{authState.user.name}{" !"}
                    </p>
                )}
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent className="flex gap-2 items-center">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                           <HugeiconsIcon icon={Profile} size={24} className="" /> <div className="font-poppins font-semibold size-4.5 ">Profile</div>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                            <HugeiconsIcon icon={AccountSettingIcon}/><div className="font-poppins font-semibold size-4.5">Account</div>
                        </SidebarMenuButton>
                        <SidebarMenuButton 
                            // disabled={authState.user.userRole === null} 
                        className="p-4 cursor-pointer hover:bg-primary">
                            <HugeiconsIcon icon={Person} size={24} />
                            <div className="font-poppins font-semibold size-4.5">Personal</div>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                            <HugeiconsIcon icon={RupeeCircleIcon} /><div className="font-poppins font-semibold size-4.5">Donations</div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="relative">
                {/* <div className="font-poppins ">Logout</div> */}
            </SidebarFooter>
        </Sidebar>
    );
};