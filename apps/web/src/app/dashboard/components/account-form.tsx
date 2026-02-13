'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import z from "zod";

export const AccountForm = () => {
    const { state } = useAuth();

    const form = useForm({
        defaultValues: {
            username: state.user?.name,
            emailAddress: state.user?.email
        },
        onSubmit: async ({ value }) => {
            await authClient.updateUser({
                username: value.username,
            })
        },
        validators: {
            onSubmit: z.object({
                username: z.string().min(2, "Please enter a valid username"),
                emailAddress: z.email().min(4, "Please enter a valid email")
            })
        }
    })

    return (
        <div className="flex flex-col w-full min-h-screen gap-6 p-10">
            <div className="text-[38px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Account Information</div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className="mt-5">
                    <form.Field name="username">
                        {(field) => (
                            <div className="space-y-0">
                                <Label className="font-poppins font-medium text-[14px] leading-8.25 text-[#604D004D]">USERNAME</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    className="rounded-[40px] h-12 shadow-[1px_2px_7px_0px_#0000001A] italic font-poppins font-medium text-[16px] leading-[100%]"
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                <div className="mt-4">
                    <form.Field name="emailAddress">
                        {(field) => (
                            <div className="space-y-0">
                                <Label className="font-poppins font-medium text-[14px] leading-8.25 text-[#604D004D]">EMAIL ADDRESS</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    className="rounded-[40px] h-12 shadow-[1px_2px_7px_0px_#0000001A] italic font-poppins font-medium text-[16px] leading-[100%]"
                                    disabled
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                {// TODO: Implement Change password/reset password here
                }

                <div className="flex justify-end">
                    <form.Subscribe>
                        {(state) => (
                            <Button
                                variant="outline"
                                type="button"
                                className="bg-linear-to-r mt-20 w-20 from-[#DB7A04] to-[#F1980F] text-white hover:text-white font-semibold text-[15px] rounded-[40px] py-5 font-poppins hover:cursor-pointer"
                                disabled={!state.canSubmit || state.isSubmitting}
                            >
                                {state.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>

            <div className="mt-45 font-poppins italic text-[13px] font-normal leading-[100%] text-[#604D004D] text-center">
                We respect your privacy. Your personal and financial information is used only for organizational purposes, protected securely, and never shared for commercial use.
            </div>
        </div>
    )
}