import Image from "next/image";
import HeroImage from "../public/hero.jpeg";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Hero = ()  => {
    const router = useRouter();

    return (
        <div className="relative h-150 w-full overflow-hidden">
            <Image
                src={HeroImage}
                alt="Hero Section"
                fill
                className="w-screen"
                priority
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                <h1 className="text-[70px] leading-19.5 font-poppins font-bold tracking-tight">Turning Compassion</h1>
                <h1 className="text-[70px] leading-19.5 font-poppins font-bold tracking-tight">Into Lasting Change</h1>
                <Button onClick={() => router.push('/auth/signup')} className="mt-8 font-poppins rounded-[40px] bg-linear-to-r from-[#F1980F] to-[#DB7A04] px-8 py-6 text-lg">
                    Join Now
                </Button>
            </div>
        </div>
    )
}