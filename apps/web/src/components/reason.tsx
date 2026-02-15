import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import LoveIcon from "../public/love.svg";
import Image from "next/image";

export const Reason = () => {
    const router = useRouter();

    return (
        <div className="bg-white p-12 items-center flex flex-col font-poppins">
            <div className="flex flex-row">
                <div className="text-[#00897C] font-bold text-[45px] leading-12.25">
                    Be the Reason Someone
                </div>
                <div className="text-[#FFDA46] ml-2 mr-2 font-bold text-[45px] leading-12.25">
                    Smiles 
                </div>
                <div className="text-[#00897C] font-bold text-[45px] leading-12.25">
                    Today.
                </div>
            </div>
            <div className="font-bold font-poppins text-[#19998D] text-[35px] leading-12.25">
                Join our Community of Change Makers
            </div>
            <div className="mt-4 font-poppins">
                <Button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-[#F1980F] hover:bg-[#F1980D] hover:cursor-pointer border-[0.6px] p-6 rounded-[30px] border-[#CCCCCC] font-bold text-[18px] leading-8.25 text-white"
                >
                    Join Us!
                    <Image
                        src={LoveIcon}
                        alt="Love"
                        width={20}
                        height={20}
                    />
                </Button>
            </div>
        </div>
    )
}