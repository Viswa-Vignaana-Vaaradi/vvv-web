import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";
import Loader from "./loader";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ForgotPasswordForm () {
    const router = useRouter();
    const { isPending } = authClient.useSession();

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email: value.email,
                type: "forget-password"
            },
            {
                onSuccess: () => {
                    router.push(`/auth/forgot-password/verify-otp?email=${encodeURIComponent(value.email)}`);
                },
                onError: (error) => {
                    console.error(error);
                }
            },
            );
        },
        validators: {
            onSubmitAsync: z.object({
                email: z.email("Invalid email address")
            })
        },
    });

    if (isPending) {
        return <Loader />;
    }

    return (
        <div className="flex flex-row items-center justify-center p-30">
            <div className="bg-[conic-gradient(from_139.69deg_at_40.5%_34.39%,#09786F_0deg,#0E897F_133.8deg,#0F5E61_270.51deg,#09786F_360deg)] text-white font-bold font-poppins text-[45px] leading-12.25 text-wrap w-109.25 h-125.75 rounded-[50px] p-10">
                Be&nbsp;a&nbsp;Part&nbsp;of Something Meaningful
            </div>

            <div className="flex-1 mx-5 mt-10 max-w-md p-6 bg-primary">
                <h1 className="mb-6 text-center text-[40px] leading-[100%] font-extrabold font-poppins text-black">No&nbsp;Worries!</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <form.Field name="email">
                            {(field) => (
                                <div className="space-y-2 mb-4">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        value={field.state.value}
                                        placeholder="Email"
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="border border-black rounded-[40px] px-6 py-5 font-poppins font-medium text-[#604D004D] text-[25px] leading-[100%]"
                                    />
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
                                        {state.isSubmitting ? "Submitting..." : "Send OTP"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}