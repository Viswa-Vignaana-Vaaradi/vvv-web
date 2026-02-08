"use client";

import { Separator } from "@/components/ui/separator";
import DashboardProfile from "./components/dashboard-profile";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";

export default function Dashboard() {
  const { state } = useAuth();

  const userId = state.user?.id;

  const { data: aboutMe, isLoading, error } = useQuery({
    queryKey: ['aboutMe', userId],
    queryFn: async () => {
      if (!userId) throw new Error("No User ID");

      const { data, error } = await api["about-me"].get({
        $query: { userId: userId },
        $headers: {}
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch location');
      }
      return data;
    },
    enabled: !!userId,
  })

  return (
    <div className="p-2">
      <div className="p-6">
        <DashboardProfile />
      </div>
      <Separator className="border-[#00000080]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-20 my-10">
        <div className="flex flex-col">
          <div className="font-poppins mb-4 font-bold text-[#604D00] text-2xl">
            Donations
          </div>
          <Card className="bg-white rounded-3xl border-none w-70 h-37.75">
            <CardContent className="flex items-center justify-center h-full">
              Donation Data
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <div className="font-poppins mb-4 font-bold text-[#604D00] text-2xl">
            About Me
          </div>
          <Card className="bg-white rounded-3xl border-none p-6">
            <CardContent>
              <p className="font-poppins text-base text-gray-700">
                {aboutMe?.aboutMeText || "Add About Me"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}