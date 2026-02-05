import { useAuth } from "@/context/auth-context";
// import { Image } from "@imagekit/next";
import Image from "next/image";

export default function DashboardProfile() {
    const { state } = useAuth();
    
    return (
        <div className="ml-80 w-lvh flex justify-items-center gap-4 p-10 border-red-200 border-2 items-center">
            <Image
                // urlEndpoint="https://ik.imagekit.io/vvv"
                src={"/default-profile.jpg"}
                alt="Profile Picture"
                width={200}
                height={200}
                className="rounded-full border-2 border-red-400"
            />
            <div className="flex-1 flex items-center justify-between">
                <div className="font-poppins text-2xl font-bold text-[#FF9B00]">
                    {state.user?.name}
                </div>
                <div>Patron</div>
            </div>
        </div>
    );
}