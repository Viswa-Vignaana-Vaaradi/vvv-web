'use client';
import Image from "next/image";
import GreenHeart from "../../../public/green-heart.svg";
import { Button } from "@/components/ui/button";
import { columns } from "../donations/columns";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";

export const DonationsPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["donation-data"],
        queryFn: () => {

        }
    });

    return (
        <div className="flex flex-col w-full min-h-screen gap-6 p-10">
            <div className="font-poppins font-bold text-[28px] leading-8.25 text-[#604D00]">Donation Information</div>

            <div className="flex flex-row justify-around w-full rounded-[40px] p-6 bg-white">
                <Image
                    src={GreenHeart}
                    height="30"
                    width="30"
                    alt="Green-Heart"
                />

                <div className="flex flex-row items-center">
                    <div className="font-poppins font-medium text-[35px] leading-[100%] text-[#604D00]">Rs.500</div>
                    <div className="font-poppins font-medium text-[15px] leading-[100%] text-[#604D00]/50">/Month</div>
                </div>

                <div className="font-poppins font-medium text-[15px] leading-[100%] text-[#604D00]/50 ">
                    Next: {/*TODO: Integrate the donation api here*/}
                </div>

                <Button
                    className="font-poppins font-semibold text-[18px] leading-[100%] text-white bg-linear-to-r from-[#F1980F] to-[#DB7A04] rounded-[40px] w-30 py-5"
                    // TODO: onClick, redirect to the payment gateway here
                >
                    PAY
                </Button>
            </div>

            <div className="font-poppins font-bold text-[25px] leading-8.25 text-[#604D00] mt-12">Donation History</div>

            {/*TODO: Integrate the donations api here */}

            {/* <DataTable columns={columns} 
                // @ts-expect-error: yet to implement donations data here
                data={data}
            /> */}
        </div>
    )
}