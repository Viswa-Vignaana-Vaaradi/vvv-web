import VerifyOtpForm from "@/components/verify-otp";
import { Suspense } from "react";

export default function VerifyOtpPage() {
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm />
        </Suspense>
    )
}