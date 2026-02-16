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
  // Extract ID even if href is "/#about" or "#about"
  const targetId = href.includes("#") ? href.split("#")[1] : "";

  if (isHomePage && targetId) {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  } else {
    // If not home or no hash, use the router
    router.push(href as any);
  }
};

  return (
    <header className="h-22 flex flex-col justify-center bg-[linear-gradient(90.2deg,#00A295_0.04%,#09786F_100%)]">
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          <Image
            src="/icon.png"
            alt="VVV Logo"
            width={60}
            height={60}
            onClick={() => router.push("/")}
            className="cursor-pointer"
          />
          <span onClick={() => router.push("/")} className="self-center hover:cursor-pointer text-center mr-10 text-white font-poppins text-[25px] leading-[85%] font-bold whitespace-nowrap">
            VISWA VIGNANA <br /> VAARADHI
          </span>

          {navLinks.map((link) => (
            <Button
              variant="link"
              key={link.label}
              onClick={(e) => handleScroll(e as any, link.href)}
              className="text-white/80 flex items-center justify-center mt-3 text-[18px] hover:text-white font-poppins font-semibold transition-colors cursor-pointer"
            >
              {link.label}
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}
          <Button
            onClick={(e) => handleScroll(e as any, "/#donate")}
            className="bg-gradient-to-r hover:cursor-pointer font-poppins from-[#F1980F] to-[#DB7A04] text-white rounded-[40px] p-5 font-semibold text-[17px] leading-[100%]"
          >
            Donate
          </Button>

          {/* <UserMenu /> */}
          <Button onClick={() => state.isAuthenticated ? router.push("/dashboard") : router.push("/auth/signup")} className="font-poppins hover:cursor-pointer p-5 text-white bg-gradient-to-r from-[rgba(204,204,204,0.5)] to-[rgba(255,255,255,0.5)] font-semibold text-[17px] leading-[100%] border-[0.5px] border-white rounded-[40px]">
            {state.isAuthenticated ? "Profile" : "Sign Up"}
          </Button>
        </div>
      </div>
    </header>
  );
}
