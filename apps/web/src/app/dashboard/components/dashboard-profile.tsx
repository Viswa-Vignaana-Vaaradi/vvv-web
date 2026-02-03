import { useAuth } from "@/context/auth-context";
import { Image } from "@imagekit/next";

export default function DashboardProfile() {
    const { state } = useAuth();
    
    return (
        <div className="ml-80 grid grid-cols-3 gap-4 p-10">
            <Image
                urlEndpoint="https://ik.imagekit.io/vvv"
                src={state.user?.image || "/default-profile.png"}
                alt="Profile Picture"
                width={200}
                height={200}
                className="rounded-full"
            />
            <h2 className="font-poppins text-2xl font-bold mb-4 size-8.75 text-[#FF9B00]">{state.user?.name}</h2>
            
        </div>
    );
}