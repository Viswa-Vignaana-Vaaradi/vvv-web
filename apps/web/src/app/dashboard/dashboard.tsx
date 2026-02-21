"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import DashboardProfile from "./components/dashboard-profile";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAboutText, setTempAboutText] = useState("");

  const userId = state.user?.id;

  const { data: aboutMe, isLoading: isAboutLoading } = useQuery({
    queryKey: ['aboutMe', userId],
    queryFn: async () => {
      const { data, error } = await api["about-me"].get({ 
        $query: { userId: userId! },
        $headers: {}
      });
      if (error) throw new Error(error.message);
      setTempAboutText(data?.aboutMeText || "");
      return data;
    },
    enabled: !!userId,
  });

  const { data: donationData, isLoading: isDonationLoading } = useQuery({
    queryKey: ['donations', userId],
    queryFn: async () => {
      const { data, error } = await api.user.donations.get({ 
        $query: { userId: userId! },
        $headers: {},
        $fetch: {
          credentials: "include"
        }
      });
      console.log("Donation Data:", data);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });

  const aboutMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await api["about-me"].post({ 
        aboutMeText: text,
        $query: { userId: userId! },
        $headers: {},
        $fetch: {
          credentials: "include"
        }
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutMe', userId] });
      setIsEditingAbout(false);
    },
  });

  return (
    <div className="p-2">
      <div className="p-6">
        <DashboardProfile />
      </div>
      <Separator className="border-[#00000080]" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-20 my-10">
        
        {/* DONATIONS SECTION */}
        <div className="flex flex-col">
          <div className="font-poppins mb-4 font-bold text-[#604D00] text-2xl">
            Donations
          </div>
          <Card className="bg-white rounded-3xl border-none w-full min-h-[150px]">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              {isDonationLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : donationData?.totalAmount && donationData.totalAmount > 0 ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-poppins">Total Contributed</p>
                  <p className="text-4xl leading-[100%] font-bold text-[#43C000] font-poppins">
                    Rs. {donationData.totalAmount}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    {donationData.count} successful transactions
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 font-poppins italic">No donations to show yet.</p>
                  {/* <Button variant="link" className="text-[#0E897F] mt-2">Make your first contribution</Button> */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="font-poppins font-bold text-[#604D00] text-2xl">
              About Me
            </div>
            {!isEditingAbout && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#0E897F] font-semibold"
                onClick={() => setIsEditingAbout(true)}
              >
                {aboutMe?.aboutMeText ? "Edit" : "Add"}
              </Button>
            )}
          </div>

          <Card className="bg-white rounded-3xl border-none p-6 min-h-[150px]">
            <CardContent className="p-0">
              {isEditingAbout ? (
                <div className="space-y-4 font-poppins">
                  <Textarea 
                    value={tempAboutText}
                    onChange={(e) => setTempAboutText(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px] font-poppins rounded-xl border-gray-200 focus:ring-[#0E897F]"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" className="font-poppins" onClick={() => setIsEditingAbout(false)}>Cancel</Button>
                    <Button 
                      className="bg-[#0E897F] hover:bg-[#0c7a71] font-poppins"
                      onClick={() => aboutMutation.mutate(tempAboutText)}
                      disabled={aboutMutation.isPending}
                    >
                      {aboutMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="font-poppins text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aboutMe?.aboutMeText || "Tell the community about your journey and why you joined us..."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
