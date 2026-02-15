'use client';
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../donations/columns";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GreenHeart from "../../../public/green-heart.svg";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";

export const DonationsPage = () => {
    const { state } = useAuth();
    const userId = state.user?.id;

    const { data, isLoading } = useQuery({
        queryKey: ["donation-history", userId],
        queryFn: async () => {
            const { data, error } = await api.user.donations.history.get({
                $query: { userId: userId! }
            });
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!userId,
    });

    return (
        <div className="flex flex-col w-full min-h-screen gap-6 p-10">
            {/* <div className="font-poppins font-bold text-[28px] leading-tight text-[#604D00]">
                Donation Information
            </div> */}

            {/* TOP CARD: Active Subscription */}
            {/*TODO: Integrate payments api here */}
            {/* <div className="flex flex-row items-center justify-around w-full rounded-[40px] p-8 bg-white shadow-sm border border-gray-100">
                <Image src={GreenHeart} height="40" width="40" alt="Green-Heart" />

                <div className="flex flex-row items-center">
                    <div className="font-poppins font-medium text-[35px] text-[#604D00]">
                        ₹{data?.subscription?.amount || 0}
                    </div>
                    <div className="font-poppins font-medium text-[15px] text-[#604D00]/50 ml-1">
                        /{data?.subscription?.frequency}
                    </div>
                </div>

                <div className="font-poppins font-medium text-[15px] text-[#604D00]/50">
                    Next: <span className="text-[#604D00]">{data?.subscription?.nextDate}</span>
                </div>

                <Button className="font-poppins font-semibold text-[18px] text-white bg-gradient-to-r from-[#F1980F] to-[#DB7A04] rounded-[40px] px-10 py-6 hover:opacity-90 transition-all">
                    PAY
                </Button>
            </div> */}

            <div className="font-poppins font-bold text-[25px] mt-12 text-[#604D00]">
                Donation History
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-10 text-center text-gray-400 font-poppins">Loading history...</div>
                ) : (
                    <DataTable
                        columns={columns} 
                        data={data?.history || []} 
                    />
                )}
            </div>
        </div>
    );
};
