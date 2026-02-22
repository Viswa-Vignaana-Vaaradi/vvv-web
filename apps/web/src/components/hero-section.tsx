'use client';
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import { Video } from "@imagekit/next";
import { useRouter } from "next/navigation";

export const Hero = ({ onAction, onTriggerAuth }: { onAction: (val: "patron" | "volunteer") => void; onTriggerAuth: () => void }) => {
    const handleSelection = (type: "patron" | "volunteer") => {
    onAction(type);

    setTimeout(() => {
      const element = document.getElementById("action-view");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    setTimeout(() => {
        onTriggerAuth();
    }, 1200);
  };
  const router = useRouter();
  const { state } = useAuth();
    
    return (
        <div className="relative h-150 w-full overflow-hidden">
            <Video
                src="/Website%20BGV.mp4"
                controls={false}
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[5]" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <h1 className="text-[70px] leading-19.5 font-poppins font-semibold tracking-tight">Turning Compassion</h1>
                <h1 className="text-[70px] leading-19.5 font-poppins font-semibold tracking-tight">Into Lasting Change</h1>
                {state.user?.userRole ? (
                    <Button onClick={() => router.push('/auth/signup')} className="mt-8 hover:cursor-pointer font-poppins rounded-[40px] bg-linear-to-r from-[#F1980F] to-[#DB7A04] px-8 py-6 text-lg">
                        Join Now
                    </Button>
                ) : (
                    <div className="flex flex-row">
                        <Button 
                            onClick={() => handleSelection("patron")}
                            className="mt-8 hover:cursor-pointer font-poppins font-semibold rounded-[40px] bg-linear-to-r from-[#F1980F] to-[#DB7A04] px-8 py-6 text-lg"
                        >
                            Be a Patron
                        </Button>
                        <Button 
                            onClick={() => handleSelection("volunteer")}
                            className="mt-8 ml-4 hover:cursor-pointer font-poppins font-semibold rounded-[40px] bg-linear-to-r from-[#F1980F] to-[#DB7A04] px-8 py-6 text-lg"
                        >
                            Be a Volunteer
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}