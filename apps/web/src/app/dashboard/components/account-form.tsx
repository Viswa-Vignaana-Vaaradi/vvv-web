import { useAuth } from "@/context/auth-context"
import { useForm } from "@tanstack/react-form"
import { username } from "better-auth/plugins"
import z from "zod"

export const AccountForm = () => {
    const { state } = useAuth();

    const form = useForm({
        defaultValues: {
            username: state.user?.name,
            emailAddress: state.user?.email
        },
        onSubmit: async ({ value }) => {

        },
        validators: {
            onSubmit: z.object({
                username: z.string().min(2, "Please enter a valid username"),
                emailAddress: z.email().min(4, "Please enter a valid email")
            })
        }
    })

    return (
        <div className="flex w-full min-h-screen gap-6 p-10">
            <div className="text-[38px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Account Information</div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div>
                    <form.Field name="username">
                        {(field) => (
                            <div className="space-y-2">
                                
                            </div>
                        )}
                    </form.Field>
                </div>
            </form>
        </div>
    )
}