"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";

export default function Header() {
  const { state } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "ABOUT US", href: "/#about" },
    { label: "MISSIONS", href: "/#missions" },
    { label: "GALLERY", href: "/#gallery" },
    { label: "CONTACT", href: "/#contact" },
  ] as const;

  const handleScroll = (e: React.MouseEvent, href: string) => {
  const isHomePage = pathname === "/";
  const targetId = href.includes("#") ? href.split("#")[1] : "";

  if (isHomePage && targetId) {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  } else {
    router.push(href as any);
  }
};

  return (
    <header className="h-22 sticky top-0 z-50 flex items-center bg-[linear-gradient(90.2deg,#00A295_0.04%,#09786F_100%)] shadow-md">
      <div className="flex w-full items-center justify-between px-10">
        
        <div 
          className="flex items-center gap-4 cursor-pointer shrink-0" 
          onClick={() => router.push("/")}
        >
          <Image src="/icon.png" alt="VVV Logo" width={60} height={60} priority />
          <span className="text-white font-poppins text-[22px] leading-[85%] font-semibold whitespace-nowrap">
            VISWA VIGNANA <br /> VAARADHI
          </span>
        </div>

        <nav className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              variant="link"
              key={link.label}
              onClick={(e) => handleScroll(e as any, link.href)}
              className="text-white/80 text-[18px] hover:text-white font-poppins font-semibold transition-colors cursor-pointer"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Button
            onClick={(e) => handleScroll(e as any, "/#donate")}
            className="bg-gradient-to-r from-[#F1980F] to-[#DB7A04] hover:opacity-90 text-white rounded-[40px] px-8 py-6 h-12 font-semibold text-[17px] font-poppins shadow-lg cursor-pointer"
          >
            Donate
          </Button>

          <Button 
            onClick={() => state.isAuthenticated ? router.push("/dashboard") : router.push("/auth/signup")} 
            className="font-poppins h-12 px-8 py-6 text-white bg-white/20 hover:bg-white/30 font-semibold text-[17px] border-[0.5px] border-white rounded-[40px] backdrop-blur-sm cursor-pointer"
          >
            {state.isAuthenticated ? "Profile" : "Sign Up"}
          </Button>
        </div>

      </div>
    </header>
  );
}
