import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

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

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google"
    })
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row items-center justify-center p-30">
      <div className="bg-[conic-gradient(from_139.69deg_at_40.5%_34.39%,#09786F_0deg,#0E897F_133.8deg,#0F5E61_270.51deg,#09786F_360deg)] text-white font-bold font-poppins text-[45px] leading-12.25 text-wrap w-109.25 h-125.75 rounded-[50px] p-10">
        Welcome&nbsp;Back
      </div>

      <div className="flex-1 mx-5 mt-10 max-w-md p-6 bg-primary">
        <h1 className="mb-6 text-center text-[40px] leading-[100%] font-extrabold font-poppins text-black">Hi&nbsp;There!</h1>

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
                className="bg-[linear-gradient(90deg,#F1980F_0%,#DB7A04_100%)] text-white font-semibold text-[15px] rounded-[40px] py-5 w-full font-poppins"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Submitting..." : "Sign In"}
              </Button>
            )}
          </form.Subscribe>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center px-8">
              <Separator className="w-full border-t border-gray-300" />
            </div>
            
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-muted-foreground bg-primary font-poppins">or</span>
            </div>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                variant="outline"
                type="button"
                className="bg-white text-black font-semibold text-[15px] rounded-[40px] py-5 w-full font-poppins hover:cursor-pointer"
                disabled={!state.canSubmit || state.isSubmitting}
                onClick={() => handleGoogleLogin()}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>                
                {state.isSubmitting ? "Submitting..." : "Login with Google"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/auth/signup")}
            className="text-[#604D00] font-poppins font-medium text-[12px] leading-[100%] tracking-normal hover:cursor-pointer"
          >
            Don&apos;t have an account?
            <span className="italic">Sign&nbsp;Up</span>
          </Button>
        </div>

        <div className="mt-4 font-poppins underline text-[12px] leading-[100%] text-[#604D00] font-medium flex items-center justify-center hover:cursor-pointer"
          onClick={() => router.push("/auth/forgot-password")}
        >
          Forgot&nbsp;Password?
        </div>
      </div>
    </div>
  );
}
