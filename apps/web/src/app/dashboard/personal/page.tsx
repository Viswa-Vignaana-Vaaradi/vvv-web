'use client';
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default async function PersonalPage () {
    const { state } = useAuth();
    const router = useRouter();

    if (state.user?.userRole === "VOLUNTEER") {
        router.push("/dashboard/personal/volunteer");
    } else if (state.user?.userRole === "PATRON") {
        router.push("/dashboard/personal/patron");
    } else {
        router.push("/dashboard");
    }
};