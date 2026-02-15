"use client";
import UserMenu from "./user-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "#about" },
    { label: "Missions", href: "#missions" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ] as const;
  const router = useRouter();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="h-16 flex flex-col justify-center bg-[linear-gradient(90.2deg,#00A295_0.04%,#09786F_100%)]">
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          <Image
            src="/icon.png"
            alt="VVV Logo"
            width={50}
            height={50}
            onClick={() => router.push("/")}
            className="cursor-pointer"
          />
          <span className="self-center text-white font-poppins text-[25px] leading-[85%] font-bold whitespace-nowrap">
            VISWA VIGNANA VAARADI
          </span>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-white/80 flex items-center justify-around ml-10 text-[15px] hover:text-white font-poppins font-semibold transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
