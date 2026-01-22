"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "./loader";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function VerifyOtpForm() {
    const router = useRouter();
    const { isPending } = authClient.useSession();
    const searchParams  = useSearchParams();
    const email = searchParams.get("email") || "";
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [seconds, setSeconds] = useState(180);
    const [canResend, setCanResend] = useState(false);
    // TODO: Save the timer to localStorage to persist across page reloads

    useEffect(() => {
        if (!email) return;
        if (seconds <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);
    
    const form = useForm({
        defaultValues: {
            otp: "",
        },
        onSubmit: async ({ value }) => {
            setErrorMessage("");
            const { data, error } = await authClient.emailOtp.checkVerificationOtp({
                email: email,
                type: "forget-password",
                otp: value.otp
            },
            {
                onSuccess: () => {
                    setSuccessMessage("OTP verified successfully! Redirecting to reset password...");
                    setTimeout(() => {
                        router.push(`/auth/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(value.otp)}`);
                    }, 500);
                },
                onError: (error) => {
                    console.error(error);
                    setErrorMessage(String(error?.response));
                }
            },
            );
        },
        validators: {
            onSubmitAsync: z.object({
                otp: z.string().length(6, "OTP must be 6 digits")
            })
        },
    });

    const handleResendOtp = async () => {
        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "forget-password"
        },
        {
            onSuccess: () => {
                setSuccessMessage("OTP resent successfully!");
                setSeconds(180);
                setCanResend(false);
                console.log("OTP resent successfully");
            },
            onError: (error) => {
                console.error(error);
                setErrorMessage(String(error?.response));
            }
        }    
    );
    }

    if (isPending) {
        return <Loader />;
    };

    return (
        <div className="flex flex-row items-center justify-center p-30">
            <div className="bg-[conic-gradient(from_139.69deg_at_40.5%_34.39%,#09786F_0deg,#0E897F_133.8deg,#0F5E61_270.51deg,#09786F_360deg)] text-white font-bold font-poppins text-[45px] leading-12.25 text-wrap w-109.25 h-125.75 rounded-[50px] p-10">
                Be&nbsp;a&nbsp;Part&nbsp;of Something Meaningful
            </div>

            <div className="flex-1 mx-5 mt-10 max-w-md p-6 bg-primary">
                <h1 className="mb-6 text-center text-[40px] leading-[100%] font-extrabold font-poppins text-black">No&nbsp;Worries!</h1>
                <h4 className="mb-6 text-center text-[15px] leading-[100%] font-light font-poppins text-black">We&apos;ve sent an OTP to {email}</h4>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <form.Field name="otp">
                            {(field) => (
                                <div className="space-y-2 flex flex-col items-center mb-4">
                                    <InputOTP 
                                        maxLength={6}
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={field.handleChange}
                                        className="border border-black rounded-[40px] px-6 py-5 font-poppins font-medium text-[#604D004D] text-[25px] leading-[100%]"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    {field.state.meta.errors.map((error, index) => (
                                        <p key={index} className="text-red-500 text-xs font-poppins">
                                            {error?.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        <div className="flex items-center justify-center">
                            <form.Subscribe>
                                {(state) => (
                                    <Button
                                        type="submit"
                                        className="bg-[linear-gradient(90deg,#F1980F_0%,#DB7A04_100%)] text-white font-semibold text-[15px] rounded-[40px] px-12 py-5 font-poppins hover:cursor-pointer w-full"
                                        disabled={!state.canSubmit || state.isSubmitting}
                                    >
                                        {state.isSubmitting ? "Verifying..." : "Verify OTP"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </div>

                        {successMessage && (
                            <p className="text-xs font-poppins mt-2">{successMessage}</p>
                        )}
                        {errorMessage && (
                            <p className="text-red-500 text-xs font-poppins mt-2">{errorMessage}</p>
                        )}

                        {canResend ? (
                            <Button
                                className="flex justify-center items-center mt-4 font-poppins text-black hover:cursor-pointer"
                                variant="link"
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </Button>
                        ) : (
                            <div className="flex justify-center items-center mt-4 font-poppins">OTP is valid for {seconds} seconds</div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}