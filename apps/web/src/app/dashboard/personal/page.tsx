'use client';
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function PersonalPage () {
    const { state } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (state.user?.userRole === "VOLUNTEER") {
            router.push("/dashboard/personal/volunteer");
        } else if (state.user?.userRole === "PATRON") {
            router.push("/dashboard/personal/patron");
        } else {
            router.push("/dashboard");
        }
    }, [state.user?.userRole, router]);

    return null;
};