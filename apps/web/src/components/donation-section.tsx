'use client';
import Image from "next/image";
import GreenCheck from "../public/green-check.svg";
import WhiteLove from "../public/love.svg";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/eden";
import { useRouter } from "next/navigation";
import { env } from "@repo/env/web";
import { useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/auth-context";
import posthog from "posthog-js";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type DonationFormValues = {
  fullName: string;
  phoneNumber: string;
  email: string;
  amount: string;
  customAmount: string;
};

export const DonationSection = () => {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { state } = useAuth();

    const mutation = useMutation({
        mutationFn: async (value: DonationFormValues) => {
            const isCustom = value.amount === "Other" || !value.amount;
            const selectedFrequency = isCustom ? "One-Time" : "Monthly";

            const { data, error } = await api.payments.checkout.post({
                amount: value.customAmount ? "Other" : value.amount, 
                frequency: selectedFrequency,
                otherAmount: value.customAmount,
                $query: { userId: state.user?.id ?? "" },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) throw new Error(error.message);
            if (!data) throw new Error("No response from server");
            
            return data;
        },
        onSuccess: (checkoutSession, variables) => {
            if (typeof window === 'undefined' || !window.Razorpay) {
                setErrorMessage("Payment gateway is still loading. Please try again in a moment.");
                return;
            }

            const isSubscription = checkoutSession.type === "subscription";

            const options = {
                key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: variables.amount === "Other" 
                ? Number(variables.customAmount) * 100 
                : Number(variables.amount) * 100,
                currency: "INR",
                name: variables.fullName,
                frequency: isSubscription ? "Monthly" : "One-Time",
                order_id: checkoutSession.id,
                ...(!isSubscription && {
                amount: variables.amount === "Other" 
                    ? Number(variables.customAmount) * 100 
                    : Number(variables.amount) * 100,
                }),
                handler: function ( response: any) {
                    console.log("Payment ID: ", response.razorpay_payment_id);
                    setSuccessMessage("Payment is successful!!");

                    // Capture donation payment success event
                    const donationAmount = variables.amount === "Other"
                        ? Number(variables.customAmount)
                        : Number(variables.amount);
                    posthog.capture("donation_payment_success", {
                        amount: donationAmount,
                        currency: "INR",
                        frequency: isSubscription ? "Monthly" : "One-Time",
                        payment_id: response.razorpay_payment_id,
                    });

                    router.push('/dashboard');
                    //TODO: Add verify payment API to verify payments
                },
                "modal": {
                    "ondismiss": function(){
                        console.log('Checkout form closed by the user');
                        setSuccessMessage("")
                        setErrorMessage("")
                    }
                },
                prefill: {
                    name: variables.fullName,
                    contact: variables.phoneNumber,
                    email: variables.email
                }
            };

            const rzp = new window.Razorpay(options);
                
            rzp.on('payment.failed', function (response: any) {
                setErrorMessage("Payment failed:" + response.error.description);

                // Capture donation payment failed event
                const failedAmount = variables.amount === "Other"
                    ? Number(variables.customAmount)
                    : Number(variables.amount);
                posthog.capture("donation_payment_failed", {
                    amount: failedAmount,
                    currency: "INR",
                    frequency: isSubscription ? "Monthly" : "One-Time",
                    error_code: response.error.code,
                    error_description: response.error.description,
                });
            });
            
            rzp.open();
        },
        onError: (error: Error) => {
            setSuccessMessage("");
            console.error(error);
            setErrorMessage(error.message || "An unexpected error occurred during submission.");
        }
    });

    const form = useForm({
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            amount: "",
            customAmount: ""
        },
        onSubmit: async ({ value }) => {
            setSuccessMessage("Opening Payment Page...")

            // Capture donation initiated event
            const donationAmount = value.customAmount
                ? Number(value.customAmount)
                : Number(value.amount);
            const frequency = value.customAmount ? "One-Time" : "Monthly";
            posthog.capture("donation_initiated", {
                amount: donationAmount,
                currency: "INR",
                frequency: frequency,
                email: value.email,
            });

            mutation.mutate(value);
        },
        validators: {
            onSubmit: z.object({
                fullName: z.string().min(2, "Enter a valid name"),
                email: z.email("Invalid email address"),
                phoneNumber: z.string("Ivalid phone number"),
                amount: z.string("Invalid amount selected"),
                customAmount: z.string("Invalid custom amount")
            })
        }
    })

    return (
        <div className="bg-[#FFFBEB] px-30 py-20 gap-4 items-center flex flex-row font-poppins">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <div className="flex-1">
                <div className="text-[#604D00] font-bold text-[42px] leading-[130%]">
                    A Small Help Can Create Big Change.
                </div>
                <div className="flex flex-row mt-8">
                    <Image
                        src={GreenCheck}
                        alt="GreenCheck"
                        width={28}
                        height={28}
                    />
                    <div className="text-black text-[18px] ml-3 leading-[100%] font-medium">Transparency: Regular updates on how your funds are used.</div>
                </div>
                <div className="flex flex-row mt-6">
                    <Image
                        src={GreenCheck}
                        alt="GreenCheck"
                        width={28}
                        height={28}
                    />
                    <div className="text-black text-[18px] ml-4 leading-[100%] font-medium">Direct Impact: Funds go directly to field projects.</div>
                </div>
            </div>
            <div className="flex-1 ml-4 bg-white rounded-[30px] shadow-[0px_2px_8px_5px_#0000000D] py-10 px-20">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <form.Field name="fullName">
                            {(field) => (
                                <div className="flex-1">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Full Name"
                                        required
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black px-3 font-poppins font-medium text-[14px] leading-8.25"
                                    />
                                    {field.state.meta.errors.map((error) => (
                                        <p key={error?.message} className="text-red-500 font-poppins">
                                            {error?.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="phoneNumber">
                            {(field) => (
                                <div className="flex-1">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Phone No."
                                        required
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black px-3 font-poppins font-medium text-[14px] leading-8.25"
                                    />
                                    {field.state.meta.errors.map((error) => (
                                        <p key={error?.message} className="text-red-500 font-poppins">
                                            {error?.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name="email">
                        {(field) => (
                            <div className="w-full">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    placeholder="E-mail ID"
                                    required
                                    className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
                                />
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500 font-poppins">
                                        {error?.message}
                                    </p>
                                ))}  
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [state.values.amount, state.values.customAmount]}
                    >
                        {([amountValue, customAmountValue]) => (
                            <form.Field name="amount">
                                {(field) => (
                                    <div>
                                        <Label className="font-poppins font-medium text-[#0000004D] text-[14px] block mb-3">
                                            Select Amount
                                        </Label>
                                        <div className="flex flex-row gap-3">
                                            {[99, 499, 999].map((amt) => {
                                                const isSelected = amountValue === amt.toString();
                                                const isButtonsDisabled = !!customAmountValue;

                                                return (
                                                    <Button
                                                        key={amt}
                                                        type="button"
                                                        disabled={isButtonsDisabled}
                                                        onClick={() => {
                                                            const newValue = field.state.value === amt.toString() ? "" : amt.toString();
                                                            field.handleChange(newValue);
                                                        }}
                                                        className={`flex-1 rounded-[10px] font-poppins font-semibold border-[0.6px] transition-all ${
                                                            isSelected
                                                            ? "bg-[#F1980F] text-white border-[#F1980F] hover:bg-[#F1980D]"
                                                            : "bg-white text-[#0000004D] border-[#CCCCCC] hover:bg-white"
                                                        } ${isButtonsDisabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
                                                    >
                                                        <span className="font-semibold text-[15px]">Rs. {amt}</span>
                                                        <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#00000033]"}`}>
                                                            per month
                                                        </span>
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        )}
                    </form.Subscribe>


                    <form.Subscribe
                        selector={(state) => [state.values.amount]}
                    >
                        {([amountValue]) => (
                            <form.Field name="customAmount">
                                {(field) => (
                                    <div className="space-y-0">
                                        <Label className="font-poppins font-medium text-[#0000004D] text-[14px] leading-8.25">
                                            Enter Custom Amount (One-time)
                                        </Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            disabled={!!amountValue}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Enter Amount"
                                            required={!amountValue}
                                            className={`border-0 rounded-[10px] italic bg-[#F6F6F6] px-3 font-poppins font-medium text-[14px] leading-8.25 transition-all ${
                                            !!amountValue ? "opacity-50 cursor-not-allowed" : "text-black"
                                            }`}
                                        />
                                    </div>
                                )}
                            </form.Field>
                        )}
                    </form.Subscribe>

                    <div className="flex items-center justify-center">
                        <Button
                            type="submit"
                            className="border-[0.6px] border-[#CCCCCC] bg-[#F1980F] hover:bg-[#F1980D] hover:cursor-pointer leading-8.25 text-white font-poppins font-bold py-6 px-6 rounded-[40px] text-[18px] transition-all"
                        >
                            Donate Now <Image src={WhiteLove} width={20} height={20} alt="Love" />
                        </Button>
                    </div>

                    {successMessage && (
                <p className="text-xs text-green-600 font-poppins mt-2 flex justify-center items-center">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-500 text-xs font-poppins mt-2 flex justify-center items-center">{errorMessage}</p>
            )}
                </form>
            </div>
        </div>
    )
}