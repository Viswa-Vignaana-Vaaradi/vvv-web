import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import DefaultProfile from "../../../public/default-profile.jpg"
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardProfile() {
    const { state } = useAuth();
    
    return (
        <div className="w-full flex gap-4 p-10 items-center">
            <Image
                src={state.user?.image || DefaultProfile}
                alt="Profile Picture"
                width={200}
                height={200}
                className="rounded-full"
            />

            <div className="grid grid-cols-[1fr_auto] grid-rows-3 w-full">
                <div className="col-span-1 flex items-center">
                    <div className="font-poppins text-2xl font-bold text-[#FF9B00]">
                        {state.user?.name}
                    </div>
                </div>
                
                <Card className="col-span-1 border-none flex p-0 items-center justify-center bg-white rounded-[40px] mb-2">
                    <CardContent className="font-semibold leading-[100%] text-[#0E897F]">
                        PATRON
                    </CardContent>
                </Card>

                <div className="col-span-1 flex items-center underline italic font-poppins size-3.25 leading-[100%] text-[13px] whitespace-nowrap">
                    Want to be a Patron?
                </div>
            
                <div className="col-span-1 flex items-center justify-end font-poppins font-semibold size-4.5 leading-8.25 text-[#604D00CC]">
                    Joined: 
                </div>

                <div className="col-span-1 flex items-center underline italic font-poppins size-3.25 leading-[100%] text-[13px] whitespace-nowrap">
                    Want to be a Volunteer?
                </div>
                
                <div className="col-span-1 flex items-center justify-end font-poppins font-semibold size-3.75 leading-8.25 text-[#604D00CC]">
                    Location
                </div>
            </div>
        </div>
    );
}