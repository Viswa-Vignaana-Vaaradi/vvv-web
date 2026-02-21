"use client";

import { AboutUs } from "@/components/about-us";
import { ContactUs } from "@/components/contact-us";
import { DonationSection } from "@/components/donation-section";
import { Footer } from "@/components/footer";
import { GalleryIntro } from "@/components/gallery-intro";
import { Hero } from "@/components/hero-section";
import { Missions } from "@/components/missions";
import { NumbersSection } from "@/components/numbers-section";
import { Reason } from "@/components/reason";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { PatronForm } from "./dashboard/components/patron-form";
import { VolunteerForm } from "./dashboard/components/volunteer-form";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { env } from "@repo/env/web";


export default function Home() {
  const [activeView, setActiveView] = useState<"patron" | "volunteer" | null>(null);
  const { state } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const shouldShowDialog = showAuthDialog && !state.isAuthenticated;

  const handleGoogleLogin = async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${env.NEXT_PUBLIC_CALLBACK_URL}/#action-view`,
      })
    }

  return (
    <div className="scroll-smooth">
      <Hero onAction={setActiveView} onTriggerAuth={() => setShowAuthDialog(true)} />

      {activeView && (
        <section id="action-view" className="relative min-h-screen bg-slate-50 border-b">
          <div className={shouldShowDialog ? "pointer-events-none" : "transition-all duration-700"}>
            {activeView === "patron" ? <PatronForm /> : <VolunteerForm />}
          </div>

          <Dialog 
            open={shouldShowDialog} 
            onOpenChange={(open) => {
              if (!open) {
                setShowAuthDialog(false);
                setActiveView(null);
              }
            }}
          >
            <DialogContent className="sm:max-w-md font-poppins rounded-[25px]">
              <Button
                variant="ghost"
                type="button"
                className="bg-[#FFFFFF] text-black hover:cursor-pointer text-[22px] font-bold rounded-[40px] py-5 w-full font-poppins"
                onClick={() => handleGoogleLogin()}
              >
              <svg width="10" height="10" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.987" fill-rule="evenodd" clip-rule="evenodd" d="M8.7939 0.0896484C9.86378 -0.0298828 10.4969 -0.0298828 11.6464 0.0896484C13.6813 0.39083 15.5677 1.33142 17.0327 2.77541C16.0427 3.7112 15.0657 4.66066 14.102 5.6235C12.2564 4.05927 10.1963 3.69821 7.92177 4.54034C6.25325 5.3077 5.09138 6.55122 4.43618 8.2709C3.36547 7.47377 2.30871 6.65808 1.26638 5.8242C1.19395 5.78607 1.11121 5.77211 1.03027 5.78435C2.686 2.59193 5.27339 0.693207 8.79243 0.0881727" fill="#F44336"/>
                <path opacity="0.997" fill-rule="evenodd" clip-rule="evenodd" d="M1.02746 5.784C1.11108 5.77121 1.19027 5.78449 1.26504 5.82385C2.30737 6.65773 3.36413 7.47342 4.43483 8.27055C4.26635 8.9406 4.16014 9.62479 4.11756 10.3144C4.15396 10.9814 4.25972 11.6361 4.43483 12.2785L1.10714 14.9274C-0.341989 11.8993 -0.368552 8.85148 1.02746 5.784Z" fill="#FFC107"/>
                <path opacity="0.999" fill-rule="evenodd" clip-rule="evenodd" d="M16.8752 18.1354C15.8391 17.2217 14.7543 16.3645 13.6257 15.5677C14.7571 14.7689 15.4438 13.6729 15.6858 12.2799H10.1416V8.42979C13.3389 8.40323 16.5348 8.43028 19.7292 8.51095C20.3352 11.8018 19.6352 14.7689 17.6293 17.4123C17.3908 17.6659 17.1381 17.9072 16.8752 18.1354Z" fill="#448AFF"/>
                <path opacity="0.993" fill-rule="evenodd" clip-rule="evenodd" d="M4.43511 12.2803C5.64518 15.2877 7.86364 16.6916 11.0905 16.4919C11.9963 16.387 12.8648 16.0706 13.6257 15.5681C14.7551 16.367 15.8383 17.2229 16.8752 18.1358C15.2323 19.6122 13.1374 20.4882 10.9326 20.6209C10.4317 20.6609 9.92832 20.6609 9.42739 20.6209C5.67125 20.1782 2.89793 18.2804 1.10742 14.9277L4.43511 12.2803Z" fill="#43A047"/>
              </svg>
                Login with Google
              </Button>
            </DialogContent>
          </Dialog>
        </section>
      )}

      <div id="about"><AboutUs /></div>
      <div id="missions"><Missions /></div>
      <NumbersSection />
      <div id="gallery"><GalleryIntro /></div>
      <div id="donate"><DonationSection /></div>
      <div id="contact" className="px-10 bg-white">
        <ContactUs />
        <Separator />
        <Reason />
      </div>
      <Footer />
    </div>
  );
}
