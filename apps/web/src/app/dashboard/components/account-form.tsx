'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";
import posthog from "posthog-js";

export const AccountForm = () => {
    const { state } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { dispatch } = useAuth();

    const form = useForm({
        defaultValues: {
            username: state.user?.name,
            emailAddress: state.user?.email
        },
        onSubmit: async ({ value }) => {
            setSuccessMessage("");
            setErrorMessage("");
            if (!value.username) {
                setErrorMessage("Username cannot be empty.");
                return;
            }
            await authClient.updateUser({
                username: value.username,
            },
            {
                onSuccess: (ctx) => {
                    setSuccessMessage("Saved Successfully!!");
                    console.log("Sign up successful");

                    // Capture account updated event
                    posthog.capture("account_updated", {
                        updated_fields: ["username"],
                    });

                    dispatch({
                        type: "UPDATE_USER",
                        payload: ctx.data
                    });
                    setTimeout(() => setSuccessMessage(""), 1000);
                },
                onError: (error) => {
                    console.error(error);
                    setErrorMessage(String(error?.response));

                    // Capture account update error
                    posthog.captureException(error);

                    setTimeout(() => setErrorMessage(""), 5000);
                },
            },
        );
        },
        validators: {
            onSubmit: z.object({
                username: z.string().min(2, "Please enter a valid username"),
                emailAddress: z.email().min(4, "Please enter a valid email")
            })
        }
    })

    const validateUsername = async ({value}: { value: string | undefined }) => {

        if (!value) {
            return undefined;
        }

        const { data, error } = await authClient.isUsernameAvailable({ username: value });

        if (data?.available) {
            return undefined;
        } else if (error) {
            const errorMessage = "Username is already taken. Please choose another one";
            console.log("Sending back the error message:", errorMessage);
            return errorMessage;
        } else {
            return "Unable to determine username availability.";
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen gap-6 p-10">
            <div className="text-[38px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Account Information</div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <div className="mt-5">
                    <form.Field
                        name="username"
                        validators={{
                            onChangeAsync: validateUsername,
                            onChangeAsyncDebounceMs: 1000
                        }}
                    >
                        {(field) => (
                            <div className="space-y-0">
                                <Label className="font-poppins font-medium text-[14px] leading-8.25 text-[#604D004D]">USERNAME</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="rounded-[40px] h-12 shadow-[1px_2px_7px_0px_#0000001A] italic font-poppins font-medium text-[16px] leading-[100%]"
                                />
                                {field.state.meta.errors && (
                                  <p className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</p>
                                )}
                                {field.state.meta.isValidating && <p className="text-gray-500">Checking&nbsp;username&nbsp;availability...</p>}
                                {!field.state.meta.isValidating && // 1. Not currently checking
                                !field.state.meta.errors.length && // 2. No errors present (sync or async)
                                field.state.meta.isTouched && // 4. User has actually interacted with the field
                                    <p className="text-green-600 text-xs font-poppins">
                                        Username&nbsp;is&nbsp;available!
                                    </p>
                                }
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
                                type="submit"
                                className="bg-linear-to-r mt-20 w-20 from-[#DB7A04] to-[#F1980F] text-white hover:text-white font-semibold text-[15px] rounded-[40px] py-5 font-poppins hover:cursor-pointer"
                                disabled={!state.canSubmit || state.isSubmitting}
                            >
                                {state.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>

                {successMessage && (
                    <p className="text-xs text-green-600 font-poppins mt-2 flex justify-center items-center">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="text-red-500 text-xs font-poppins mt-2 flex justify-center items-center">{errorMessage}</p>
                )}
            </form>

            <div className="mt-45 font-poppins italic text-[13px] font-normal leading-[100%] text-[#604D004D] text-center">
                We respect your privacy. Your personal and financial information is used only for organizational purposes, protected securely, and never shared for commercial use.
            </div>
        </div>
    )
}