import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row items-center justify-center p-30">
      <div className="bg-[conic-gradient(from_139.69deg_at_40.5%_34.39%,#09786F_0deg,#0E897F_133.8deg,#0F5E61_270.51deg,#09786F_360deg)] text-white font-bold font-poppins text-[45px] leading-12.25 text-wrap w-109.25 h-125.75 rounded-[50px] p-10">
        Be a Part of Something Meaningful
      </div>

      <div className="flex-1 mx-5 mt-10 max-w-md p-6 bg-primary">
        <h1 className="mb-6 text-center text-[40px] leading-[100%] font-extrabold font-poppins text-black">Hi There!</h1>

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
                <div className="space-y-2">
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
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border border-black rounded-[40px] px-6 py-5 font-poppins font-medium text-[#604D004D] text-[25px] leading-[100%]"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center justify-center">
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="bg-[linear-gradient(90deg,#F1980F_0%,#DB7A04_100%)] text-white font-semibold text-[15px] rounded-[40px] px-12 py-5 font-poppins"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Submitting..." : "Sign In"}
              </Button>
            )}
          </form.Subscribe>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/auth/signup")}
            className="text-[#604D00] font-poppins font-medium text-[12px] leading-[100%] tracking-normal hover:cursor-pointer"
          >
            Don&apos;t have an account?
            <span className="italic">Sign Up</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
