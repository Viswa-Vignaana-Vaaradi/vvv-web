"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";
import { HugeiconsIcon } from "@hugeicons/react";
import { AccountSettingIcon, LogOut, Logout01Icon, Logout02Icon, Logout04Icon, Logout05Icon, Person, Profile, RupeeCircleIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import ProfileIcon from "../../../public/profile.svg";
import AccountIcon from "../../../public/account-icon.svg";
import DonationIcon from "../../../public/donation-icon.svg";

export const DashboardSidebar = () => {
    const { state: authState, dispatch } = useAuth();
    const { state: sidebarState } = useSidebar();
    const router = useRouter();

    if (!authState || !authState.user) {
        console.log("User not authenticated or user data missing", authState);
        router.push('/');
    }

    const isCollapsed = sidebarState === "collapsed";

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="top-22 bg-white">
            <SidebarHeader className="flex flex-row items-center justify-around mt-10">
                {!isCollapsed && (
                    <p className="font-poppins font-bold text-2xl leading-tight text-[#FF9B00] whitespace-nowrap">
                        {"Hi "}{authState.user?.name}{" !"}
                    </p>
                )}
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent className="flex gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex flex-col gap-4 p-6">
                        <SidebarMenuButton 
                            onClick={() => router.push("/dashboard")}
                            className="rounded-none px-2 py-6 cursor-pointer hover:bg-primary border-b-[0.5px] border-[#00000080]"
                        >
                            <Image 
                                src={ProfileIcon}
                                alt="Profile Icon"
                                width={30}
                                height={30}
                                className="shrink-0"
                            />
                            <div className="font-poppins ml-2 font-semibold text-[18px] text-black leading-[100%]">
                                Profile
                            </div>
                        </SidebarMenuButton>
                        <SidebarMenuButton 
                            onClick={() => router.push('/dashboard/account')}
                            className="rounded-none px-2 py-6 cursor-pointer hover:bg-primary border-b-[0.5px] border-[#00000080]"
                        >
                            <Image 
                                src={AccountIcon}
                                alt="Account Icon"
                                width={30}
                                height={30}
                                className="shrink-0"
                            />
                            <div className="font-poppins ml-2 font-semibold text-[18px] leading-[100%]">
                                Account
                            </div>
                        </SidebarMenuButton>
                        {/* <SidebarMenuButton
                            // disabled={authState.user.userRole === null}
                            className="p-4 cursor-pointer hover:bg-primary"
                        >
                            <HugeiconsIcon icon={Person} size={24} />
                            <div className="font-poppins font-semibold text-[18px] leading-[100%]">Personal</div>
                        </SidebarMenuButton> */}
                        <SidebarMenuButton
                            onClick={() => router.push("/dashboard/donations")}
                            className="rounded-none px-2 py-6 cursor-pointer hover:bg-primary"
                        >
                            <Image 
                                src={DonationIcon}
                                alt="Donation Icon"
                                width={30}
                                height={30}
                                className="shrink-0"
                            />
                            <div className="font-poppins ml-2 font-semibold text-[18px] leading-[100%]">
                                Donations
                            </div>
                        </SidebarMenuButton>
                        <SidebarMenuButton 
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            dispatch({ type: "LOGOUT" });
                                            router.push("/");
                                        },
                                    },
                                });
                            }}
                            className="px-10 py-6 font-poppins text-[#FF0000] rounded-[10px] hover:text-[#FF0000] hover:bg-[#fadcdc] hover:cursor-pointer mt-10 flex items-center font-semibold"
                        >
                            <HugeiconsIcon icon={Logout05Icon} /> 
                            <div className="font-poppins font-semibold text-[18px] leading-[100%]">Logout</div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
};