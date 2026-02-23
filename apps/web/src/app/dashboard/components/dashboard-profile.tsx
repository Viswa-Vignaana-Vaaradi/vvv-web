"use client";

import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import DefaultProfile from "../../../public/default-profile.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit03Icon } from "@hugeicons/core-free-icons";
import { UploadButton } from "@/lib/uploadthing";

export default function DashboardProfile() {
    const { state, dispatch } = useAuth();
    const router = useRouter();

    const joiningDate = state.user?.createdAt ? new Date(state.user.createdAt).toLocaleDateString() : "";
    
    const userId = state.user?.id;

    const { data: location, isLoading, error } = useQuery({
        queryKey: ['location', state.user?.id],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");
            
            const { data, error } = await api.location.get({
                $query: { userId: userId },
                $headers: {}
            });

            if (error) {
                throw new Error(error.message || 'Failed to fetch location');
            }
            return data;
        },
        enabled: !!userId,
    });

    // const { refetch: refetchUserProfile } = useQuery({
    //     queryKey: ['userProfile', state.user?.id],
    //     queryFn: async () => {
    //         const { data, error } = await api["user-profile"].get({
    //             $headers: {}
    //         });

    //         if (error) {
    //             throw new Error(error.message || 'Failed to fetch profile');
    //         }
            
    //         // Update auth context with new user data
    //         if (data?.user) {
    //             dispatch({
    //                 type: "UPDATE_USER",
    //                 payload: data.user
    //             });
    //         }
            
    //         return data;
    //     },
    //     enabled: false, // Only refetch manually
    // });

    const { data: userRole, isLoading: isUserRoleLoading, error: userRoleError } = useQuery({
        queryKey: ['userRole', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No user ID");

            const { data, error } = await api["user-role"].get({
                $query: { userId: userId },
                $headers: {}
            });

            if (error) {
                throw new Error(error.message || "Failed to get the user role");
            }

            if (data?.userRole && state.user?.userRole !== data.userRole) {
                dispatch({
                    type: "UPDATE_USER",
                    payload: { userRole: data.userRole } 
                });
            }

            return data;
        },
        enabled: !!userId,
    });

    const { data: memberCode, error: memberCodeError, isLoading: memberCodeLoading } = useQuery({
        queryKey: ["usercode", userId],
        queryFn: async () => {
            if (!userId) throw new Error("No user ID");

            const { data, error } = await api.user["member-code"].get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            })

            if (error) {
                throw new Error(error.message || "Failed to get the user role");
            }

            return data;
        },
        enabled: !!userId,
    })

    return (
        <div className="w-full flex gap-4 px-20 items-center">
            <div className="flex flex-col gap-1 items-center">
                <Image
                    src={state.user?.image || DefaultProfile}
                    alt="Profile Picture"
                    width={200}
                    height={200}
                    className="rounded-full shrink-0"
                />
                <UploadButton
                    endpoint="profilePicture"
                    onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                            // Update local state with URL from response
                            dispatch({
                                type: "UPDATE_USER",
                                payload: { image: res[0].url }
                            });
                            // Refetch the user profile to confirm server-side update
                            // refetchUserProfile();
                        }
                    }}
                    onUploadError={(error) => {
                        console.error("Upload failed:", error);
                    }}
                    appearance={{
                        button: "!absolute !bg-[#FF9B00] hover:!bg-[#FF9B00]/90 !rounded-full !w-10 !h-10 !p-0 !border-2 !border-white !shadow-lg !flex !items-center !justify-center !cursor-pointer !transition-colors",
                        allowedContent: "hidden",
                        clearBtn: "hidden",
                    }}
                    content={{
                        button: () => <HugeiconsIcon icon={Edit03Icon} />,
                    }}
                />
            </div>

            <div className="grid grid-cols-[1fr_minmax(0,auto)] grid-rows-3 w-full gap-4">
                <div className="col-span-1 flex items-center">
                    <div className="font-poppins text-2xl font-bold text-[#FF9B00]">
                        {state.user?.name}
                    </div>
                </div>

                {state.user?.userRole ?
                    <Card className="col-span-1 w-39.25 h-10 border-none flex p-0 items-center justify-center bg-white rounded-[40px]">
                        <CardContent className="font-semibold text-[20px] leading-[100%] text-[#0E897F]">
                            {state.user?.userRole}
                        </CardContent>
                    </Card>
                    : <div className="col-span-1"></div>
                }
                
                {state.user?.userRole === null ? 
                    <div onClick={() => router.push("/dashboard/personal/patron")} className="col-span-1 flex hover:cursor-pointer items-center underline italic font-poppins text-[13px] leading-[100%] whitespace-nowrap">
                        Want to be a Patron?
                    </div>
                    : <div className="col-span-1 font-poppins font-bold text-[20px] text-[#0E897F]">
                        {memberCodeLoading 
                            ? "Loading..." 
                            : (memberCode && !('error' in memberCode)) 
                            ? memberCode.memberCode
                            : ""
                        }
                        </div>
                }
            
                <div className="col-span-1 whitespace-nowrap font-poppins font-semibold text-[18px] leading-8.25 text-[#604D00CC]">
                    Joined: {joiningDate}
                </div>

                {state.user?.userRole === null ? 
                    <div onClick={() => router.push("/dashboard/personal/volunteer")} className="col-span-1 flex hover:cursor-pointer items-center underline italic font-poppins leading-[100%] text-[13px] whitespace-nowrap">
                        Want to be a Volunteer?
                    </div>
                    : <div className="col-span-1"></div>
                }
                
                <div className="col-span-1 whitespace-nowrap flex items-center justify-center font-poppins font-semibold text-[18px] leading-8.25 text-[#604D00CC]">
                    {isLoading ? "" : (location && !('error' in location)) ? location.city : ""}
                </div>
            </div>
        </div>
    );
}