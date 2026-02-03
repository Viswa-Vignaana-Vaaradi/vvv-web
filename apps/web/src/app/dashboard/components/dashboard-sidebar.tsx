"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
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
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="top-16 h-[calc(100vh-64px)] bg-[#FFFFFF]">
            <SidebarHeader>
                {!isCollapsed && (
                    <p className="flex items-center justify-center font-poppins font-bold size-8.75 leading-8.25 text-[#FF9B00] ml-20 mt-6 whitespace-nowrap">
                        {"Hi "}{authState.user.name}{" !"}
                    </p>
                )}
            </SidebarHeader>
            <SidebarContent className="flex gap-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                           <HugeiconsIcon icon={Profile} size={24} className="" /> <div className="font-poppins font-semibold size-4.5 ">Profile</div>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                            <HugeiconsIcon icon={AccountSettingIcon}/><div className="font-poppins font-semibold size-4.5">Account</div>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="p-4 cursor-pointer hover:bg-primary">
                            {/* <Image src="/account-info.svg" alt="Account Info" width={20} height={20} /> */}
                            <HugeiconsIcon icon={Person} size={24} className="" />
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