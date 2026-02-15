import { Card, CardContent, CardHeader } from "./ui/card";
import QuestionMark from "../public/question-mark.svg";
import Vision from "../public/vision.svg";
import Approach from "../public/appraoch.svg";
import Image from "next/image";

export const AboutUs = () => {
    return (
        <div className="flex flex-col items-center bg-[#FFFBEB]">
            <div className="mt-10 font-poppins font-bold text-[#604D00] text-[45px] leading-12.25">Who We Are & What We Do</div>
            <div className="font-poppins font-medium text-[17px] leading-[100%] text-center px-10 mt-8 text-[#604D00]">Viswa Vignana Vaaradhi is a community-driven non-profit organisation uplifting rural communities through education, legal awareness, nutrition, mental health, and livelihoods, empowering people with knowledge, support, and opportunities to build self-reliant futures.</div>

            <div className="flex flex-row items-center gap-4 mt-8 px-6">
                <Card className="bg-white flex py-5 flex-col w-80 rounded-[30px] shadow-[0px_2px_8px_5px_#0000000D]">
                    <CardHeader>
                        <Image
                            src={QuestionMark}
                            width={40}
                            height={40}
                            alt="Question Mark"
                        />
                    </CardHeader>
                    <CardContent className="font-poppins font-semibold text-[18px] text-[#0D857c]">
                        Who We Are ?
                    </CardContent>
                    <CardContent className="font-poppins font-medium text-[14px] text-[#604D00] leading-[100%] text-wrap">
                        A dedicated team of volunteers and professionals focused on rural upliftment and bridging the urban- rural divide.
                    </CardContent>
                </Card>
                <Card className="bg-white flex flex-col w-80 rounded-[30px] shadow-[0px_2px_8px_5px_#0000000D]">
                    <CardHeader>
                        <Image
                            src={Vision}
                            width={40}
                            height={40}
                            alt="Vision"
                        />
                    </CardHeader>
                    <CardContent className="font-poppins font-semibold text-[18px] text-[#0D857c]">
                        Our Vision
                    </CardContent>
                    <CardContent className="font-poppins font-medium text-[14px] text-[#604D00] leading-[100%] text-wrap">
                        To create a self-sustainable and empowered rural India where every individual has access to quality life resources.
                    </CardContent>
                </Card>
                <Card className="bg-white flex flex-col w-80 rounded-[30px] shadow-[0px_2px_8px_5px_#0000000D]">
                    <CardHeader>
                        <Image
                            src={Approach}
                            width={40}
                            height={40}
                            alt="Approach"
                        />
                    </CardHeader>
                    <CardContent className="font-poppins font-semibold text-[18px] text-[#0D857c]">
                        Our Approach
                    </CardContent>
                    <CardContent className="font-poppins font-medium text-[14px] text-[#604D00] leading-[100%] text-wrap">
                        Holistic development through targeted missions in education, health, justice, and basic necessities.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}