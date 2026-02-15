import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/context/auth-context";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { dispatch } = useAuth();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link href="/auth/login">
        <Button className="text-white font-poppins bg-gradient-to-r from-[rgba(204,204,204,0.5)] to-[rgba(255,255,255,0.5)] font-semibold text-[17px] leading-[100%] border-[0.5px] border-white rounded-[40px]" variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="text-white bg-gradient-to-r from-[rgba(204,204,204,0.5)] to-[rgba(255,255,255,0.5)] font-semibold text-[17px] leading-[100%] border-[0.5px] border-white rounded-[40px]" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card font-poppins">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    dispatch({ type: "LOGOUT" });
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
