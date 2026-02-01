"use client";
import Link from "next/link";
import UserMenu from "./user-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {/* {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })} */}
          <Image
            src="/icon.png"
            alt="VVV Logo"
            width={50}
            height={50}
            onClick={() => router.push("/")}
          />
          <span className="self-center font-poppins text-2xl font-bold whitespace-nowrap">
          Viswa Vignana Vaaradi
          </span>
        </nav>
        <div className="flex items-center gap-2">
          {/* <ModeToggle /> */}
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
