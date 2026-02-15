import Image from "next/image";
import GalleryIntroBg from "../public/gallery-intro-bg.jpg";
import Gallery1 from "../public/gallery1.jpg";
import Gallery2 from "../public/gallery2.jpg";
import Gallery3 from "../public/gallery3.jpg";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02FreeIcons } from "@hugeicons/core-free-icons";

export const GalleryIntro = () => {
    const router = useRouter();
    
    return (
        <div className="relative bg-[#0E897F] p-8 overflow-hidden min-h-150 flex items-center justify-center">
            <Image
                src={GalleryIntroBg}
                alt="Gallery Section"
                fill
                className="object-cover z-0"
                priority
            />
            
            <div className="absolute inset-0 bg-[#0E897F]/80 z-10" />
            
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <h1 className="text-[42px] font-poppins font-bold tracking-tight text-white leading-[130%]">Capturing Moments of Change.</h1>
                <h1 className="mt-4 text-[17px] leading-[100%] font-poppins font-medium text-white tracking-tight">Real stories, real people, and real impact, glimpses of lives touched and communities growing stronger together.</h1>

                <div className="flex flex-row mt-8 gap-6">
                    <Image
                        src={Gallery1}
                        alt="Gallery1"
                        className="rounded-[30px] h-85 w-85 object-cover"
                    />
                    <Image
                        src={Gallery2}
                        alt="Gallery2"
                        className="rounded-[30px] h-85 w-85 object-cover"
                    />
                    <Image
                        src={Gallery3}
                        alt="Gallery3"
                        className="rounded-[30px] h-85 w-85 object-cover"
                    />
                </div>

                <Button onClick={() => router.push('/auth/signup')} className="mt-10 font-poppins rounded-[40px] bg-[#F1980F] px-4 py-4 text-sm text-white">
                    View More
                    <HugeiconsIcon icon={ArrowRight02FreeIcons} size={24} />
                </Button>
            </div>
        </div>
    )
}