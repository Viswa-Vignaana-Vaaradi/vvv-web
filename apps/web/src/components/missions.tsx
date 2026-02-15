import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import MissionMedha from "../public/mission-medha.svg";
import NyayaSadan from "../public/nyaya-sadan.svg";
import MissionTrupthi from "../public/mission-trupthi.svg";
import ManoSwasthya from "../public/mano-swasthya.svg";
import JeevaDhara from "../public/jeeva-dhara.svg";
import Idea from "../public/idea.svg";
import Image from "next/image";

export const Missions = () => {

    return (
        <div className="bg-white p-10">
            <div className="font-poppins font-semibold text-[#F1980F] text-[20px] leading-[100%]">
                OUR INITIATIVES
            </div>
            <div className="font-poppins font-bold text-[#604D00] text-[45px] leading-12.25 mt-4">
                Our Key Missions
            </div>
            <div className="font-poppins font-medium text-[17px] leading-[100%] text-black mt-4">
                Our mission areas address critical needs in education, justice, health, and livelihoods to
            </div>
            <div className="font-poppins font-medium text-[17px] leading-[100%] text-black mt-1">
                build resilient and self-reliant communities.
            </div>

            <Separator className="border border-[#C5C5C580]/50 mt-10" />

            <div className="grid grid-cols-3 mt-10 gap-6">
                <Card className="bg-[#F5F5F5] col-span-1 rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={MissionMedha}
                            width={60}
                            height={60}
                            alt="Mission Medha"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-black">
                            Mission Medha
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-black">
                        Providing educational resources,
                        scholarships, and mentorship to
                        underprivileged students to unlock their potential.
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-[#F5F5F5] rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={NyayaSadan}
                            width={60}
                            height={60}
                            alt="Nyaya Sadan"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-black">
                            Nyaya Sadan
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-black">
                        Spreading legal awareness and providing support to ensure justice reaches the last mile of rural India.
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-[#F5F5F5] rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={MissionTrupthi}
                            width={60}
                            height={60}
                            alt="Mission Trupthi"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-black">
                            Mission Trupthi
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-black">
                        Ensuring no one goes to sleep hungry by providing nutritious meals to the destitute and elderly.
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-[#F5F5F5] rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={ManoSwasthya}
                            width={60}
                            height={60}
                            alt="Mano Swasthya"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-black">
                            Mano Swasthya
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-black">
                        Destigmatising mental health issues and providing counseling services in rural communities.
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-[#F5F5F5] rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={JeevaDhara}
                            width={60}
                            height={60}
                            alt="Mano Swasthya"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-black">
                            Jeeva Dhara
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-black">
                        Improving access to clean drinking water and basic healthcare facilities to prevent disease.
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-[linear-gradient(138.97deg,#0E897F_7.02%,#18998C_93.69%)] rounded-[30px]">
                    <CardHeader>
                        <Image
                            src={Idea}
                            width={50}
                            height={50}
                            alt="Idea"
                        />
                        <div className="font-poppins font-semibold text-[20px] leading-5 text-white">
                            Have any Idea?
                        </div>
                    </CardHeader>
                    <CardContent className="font-poppins font-medium text-[15px] leading-[100%] text-white">
                        We are always looking for new ways to
                        help. Join us and suggest a mission.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}