'use client';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxLabel } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/eden";
import { Input } from "@base-ui/react/input"
import { RupeeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm, type StandardSchemaV1 } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from 'next/script';
import z from "zod";
import { env } from "@repo/env/web";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormSchema {
    fullName: string;
    dob: Date | undefined;
    profession: string;
    collegeName: string;
    otherProfession: string;
    contactNumber: string;
    involvement: string[];
    areaOfInterest: string[];
    frequency: string;
    amount: string;
    otherAmount: string;
    termsAccepted: boolean;
}

const formSchema: z.ZodType<FormSchema> = z.object({
    fullName: z.string().min(2, "Please enter your full name"),
    dob: z.union([z.date(), z.undefined()]).nullable().transform(val => val || undefined).refine(val => val !== undefined, "Date of birth is required"),
    profession: z.string().min(2, "Please select a profession"),
    collegeName: z.string().default(""),
    otherProfession: z.string().default(""),
    contactNumber: z.string().min(10, "Please enter a valid contact number"),
    involvement: z.array(z.string()).min(1, "Please select a valid wings of involvement"),
    areaOfInterest: z.array(z.string()).min(1, "Please select an area of interest"),
    frequency: z.string().min(2, "Please select a valid contribution frequency"),
    amount: z.string().min(2, "Please select a valid contribution amount"),
    otherAmount: z.string().min(2, "Please enter a valid amount"),
    termsAccepted: z.literal(true, {
        error: () => ({ message: "You must accept the terms and conditions" }),
    }),
}).superRefine((data, ctx) => {
    const professionOptionName = data.profession;
    if (professionOptionName === "Student" && (!data.collegeName || data.collegeName.length < 5)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please input a valid college name",
            path: ["collegeName"],
        });
    }
    if (professionOptionName === "Other" && !data.otherProfession) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify your profession",
            path: ["otherProfession"],
        });
    }
    if (data.amount === "Other" && (!data.otherAmount || !/^\d+(\.\d{1,2})?$/.test(data.otherAmount))) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid amount (e.g., 100 or 100.50)",
            path: ["otherAmount"]
        });
    }
});

export const PatronForm = () => {
    const { state } = useAuth();
    const userId = state.user?.id;
    const userRole = state.user?.userRole;
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();

    if (userRole === "VOLUNTEER") {
        router.push("/dashboard");
        return null;
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['professionOptions', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");

            const { data: professionOptions, error } = await api.options.professions.get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "Professions options failed to fetch");
            }
            return professionOptions;
        },
        enabled: !!userId,
    });

    const { data: involvementOptions, isLoading: involvementOptionsLoading, error: involvementOptionsError } = useQuery({
        queryKey: ['involvementOptions', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");

            const { data: involvementOptionsData, error } = await api.options.involvement.get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "Involvement options failed to fetch");
            }
            return involvementOptionsData;
        },
        enabled: !!userId,
    });

    const { data: interestOptions, isLoading: interestOptionsLoading, error: interestOptionsError } = useQuery({
        queryKey: ['interestOptions', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");

            const { data: interestOptionsData, error } = await api.options.interest.get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "Ares of interest options failed to fetch");
            }
            return interestOptionsData;
        },
        enabled: !!userId,
    });

    const { data: frequencyOptions, isLoading: frequencyOptionsLoading, error: frequencyOptionsError } = useQuery({
        queryKey: ['frequencyOptions', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");

            const { data: frequencyOptionsData, error } = await api.options["contribution-frequency"].get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "Frequency options failed to fetch");
            }

            return frequencyOptionsData;
        },
        enabled: !!userId,
    });

    const { data: amountOptions, isLoading: amountOptionsLoading, error: amountOptionsError } = useQuery({
        queryKey: ['amountOptions', userId],
        queryFn: async () => {
            if (!userId) throw new Error("No User ID");

            const { data: amountOptionsData, error } = await api.options["contribution-amount"].get({
                $query: { userId: userId },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "Amount options failed to fetch");
            }

            return amountOptionsData;
        },
        enabled: !!userId
    });

    const mutation = useMutation({
        mutationFn: async (value: FormSchema) => {
            if (!userId) {
                throw new Error("User ID is missing. Please log in again.");
            }

            const { data, error } = await api.patron.submit.post({
                fullName: value.fullName,
                dob: value.dob as Date,
                profession: value.profession,
                collegeName: value.collegeName,
                otherProfession: value.otherProfession,
                contactNumber: value.contactNumber,
                involvement: value.involvement,
                areaOfInterest: value.areaOfInterest,
                frequency: value.frequency,
                amount: value.amount,
                otherAmount: value.otherAmount,
                termsAccepted: value.termsAccepted,
                $query: {
                    userId: userId!
                },
                $headers: {},
                $fetch: {
                    credentials: "include"
                }
            });

            if (error) {
                throw new Error(error.message || "An unknown API error occurred.");
            }
            return data;
        },
        onSuccess: async (data, variables) => {
            setErrorMessage('');
            setSuccessMessage("Registration Successful!");

            queryClient.invalidateQueries({ queryKey: ['userMemberships', userId] });
            queryClient.invalidateQueries({ queryKey: ['userRole', userId] });

            const contribuationData = (data.frequency !== "" && data.amount !== "" ) || (data.amount === "Other" && data.otherAmount !== "");

            if (contribuationData) {
                setSuccessMessage("Initiating Payment process...");
                const amount = data.amount === "Other" ? data.otherAmount : data.amount;

                try {
                    const { data: checkoutSession, error } = await api.payments.checkout.post({
                        amount: data.amount ?? "",
                        frequency: data.frequency,
                        otherAmount: data.otherAmount ?? "",
                        $query: { userId: userId! },
                        $headers: {},
                        $fetch: {
                            credentials: "include"
                        }
                    });

                    if (error) throw new Error(error.message);

                    const options = {
                        key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                        amount: data.amount === "Other" ? Number(data.otherAmount) * 100 : undefined,
                        currency: "INR",
                        name: data.fullName,
                        frequency: data.frequency,
                        ...(checkoutSession.type === "subscription" ? { subscription_id: checkoutSession.id } : { order_id: checkoutSession.id }),
                        handler: function ( response: any) {
                            console.log("Payment ID: ", response.razorpay_payment_id);
                            setSuccessMessage("Payment is successful!! Redirecting...");
                            router.push('/dashboard');  
                        },
                        prefill: {
                            name: data.fullName,
                            contact: data.contactNumber,
                        }
                    };

                    const rzp = new (window).Razorpay(options);

                    rzp.on('payment.failed', function (response: any) {
                        setErrorMessage("Payment failed:" + response.error.description);
                    })

                    rzp.open();
                } catch (error: any) {
                    console.error(error);
                    setErrorMessage(error.message || "Could not initiate payment");
                }
            } else {
                form.reset();
                router.push('/dashboard');
            }
        },
        onError: (error: Error) => {
            setSuccessMessage("");
            console.error(error);
            setErrorMessage(error.message || "An unexpected error occurred during submission.");
        }
    })

    const form = useForm({
        defaultValues: {
            fullName: "",
            dob: undefined,
            profession: "",
            collegeName: "",
            otherProfession: "",
            contactNumber: "",
            involvement: [] as string[],
            areaOfInterest: [] as string[],
            frequency: "",
            amount: "",
            otherAmount: "",
            termsAccepted: false
        } as FormSchema,
        onSubmit: async ({ value }) => {
            mutation.mutate(value);
        },
        validators: {
            onSubmit: formSchema as StandardSchemaV1<FormSchema, FormSchema>,
        }
    });

    return (
        <div className="flex w-full min-h-screen gap-6 p-10">
            <Script src="https://checkout.razorpay.com" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="flex flex-1 space-y-4 space-x-6"
            >
                <div className="flex-1 border-r">
                    <div className="text-[38px] font-bold text-[#DB7A05] font-poppins leading-8.25">Patron</div>
                    <div className="text-[28px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Personal Information</div>

                    <div>
                        <form.Field name="fullName">
                            {(field) => (
                                <div className="space-y-2 flex flex-row items-center">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Full Name"
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
                                        required
                                    />
                                    <div className="font-poppins text-[14px] text-[#604D00]/50">(Will be used in certificates)</div>
                                    {field.state.meta.errors.map((error) => (
                                        <p key={error?.message} className="text-red-500 font-poppins">
                                            {error?.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="profession">
                            {(field) => {
                                const studentOption = data?.find((opt) => opt.name === "Student");
                                console.log("Student Option var:", studentOption);
                                const isStudent = String(field.state.value) === String(studentOption?.name);

                                return (
                                    <div className="space-y-2">
                                        <Combobox
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onValueChange={(val) => {
                                                field.handleChange(val ?? "");
                                                if (studentOption && val !== String(studentOption.id)) {
                                                    form.setFieldValue('collegeName', '');
                                                }
                                            }}
                                            required
                                        >
                                            <ComboboxInput placeholder="Profession" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] w-53 mt-4" />
                                            <ComboboxContent className="font-poppins">
                                                {isLoading ? (
                                                    <ComboboxItem value="loading" disabled>Loading...</ComboboxItem>
                                                        ) : (
                                                            data?.map((option) => (
                                                                <ComboboxItem key={option.id} value={option.name}>
                                                                    {option.name}
                                                                </ComboboxItem>
                                                            ))
                                                        )
                                                }
                                                <ComboboxItem value="Other">Other</ComboboxItem>
                                            </ComboboxContent>
                                        </Combobox>
                                        {field.state.meta.errors.map((error) => (
                                            <p key={error?.message} className="text-red-500 font-poppins">
                                                {error?.message}
                                            </p>
                                        ))}

                                        {isStudent && (
                                            <form.Field name="collegeName">
                                                {(subField) => (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-1">
                                                        <Input
                                                            placeholder="Enter your College Name"
                                                            value={subField.state.value}
                                                            onChange={(e) => subField.handleChange(e.target.value)}
                                                            onBlur={subField.handleBlur}
                                                            className="border-0 border-b w-53 rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary font-poppins font-medium text-[14px]"
                                                        />
                                                        {field.state.meta.errors.map((error) => (
                                                            <p key={error?.message} className="text-red-500 font-poppins">
                                                                {error?.message}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </form.Field>
                                        )}

                                        {field.state.value === "other" && (
                                            <form.Field name="otherProfession">
                                                {(field) => (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-1">
                                                        <Input
                                                            placeholder="Specify your profession"
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            onBlur={async () => {
                                                                field.handleBlur();
                                                                if (field.state.value) {
                                                                    await api.options.professions.post({
                                                                        name: field.state.value,
                                                                        $query: { userId: userId },
                                                                        $headers: {}
                                                                    });
                                                                }
                                                            }}
                                                            className="border-0 font-poppins w-53 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                                        />
                                                        {field.state.meta.errors.map((error) => (
                                                            <p key={error?.message} className="text-red-500 font-poppins">
                                                                {error?.message}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </form.Field>
                                        )}
                                    </div>
                                )
                            }}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="dob">
                            {(field) => (
                                <div className="space-y-2">
                                    <DatePicker
                                        selected={field.state.value}
                                        onSelect={(date) => field.handleChange(date || undefined)}
                                        onBlur={field.handleBlur}
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
                    
                    <div className="mt-4">
                        <form.Field name="contactNumber">
                            {(field) => (
                                <div className="space-y-2">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        placeholder="Contact Number"
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="border-0 w-53 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
                                        required
                                        type="tel"
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

                    <div>
                    <form.Field name="frequency">
                        {(field) => (
                            <div className="space-y-2">
                                <Combobox
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={(val) => {
                                        field.handleChange(val ?? "");
                                        if (val === "Other") {
                                            form.setFieldValue('frequency', 'One-Time');
                                        } else {
                                            form.setFieldValue('otherAmount', '');
                                        }
                                    }}
                                    required
                                >
                                    <ComboboxInput placeholder="Select Contribution Frequency" className="border-0 w-53 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4" />
                                    <ComboboxContent className="font-poppins">
                                        {frequencyOptionsLoading ? (
                                            <ComboboxItem value="loading" disabled>Loading...</ComboboxItem>
                                                ) : (
                                                    frequencyOptions?.map((option) => (
                                                        <ComboboxItem key={option.id} value={option.frequency}>
                                                            {option.frequency}
                                                        </ComboboxItem>
                                                    ))
                                                )
                                        }
                                    </ComboboxContent>
                                </Combobox>
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500 font-poppins">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="amount">
                        {(field) => (
                            <div className="space-y-2">
                                <Combobox
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={(val) => {
                                        field.handleChange(val ?? "");
                                        if (val !== "Other") {
                                            form.setFieldValue('otherAmount', '');
                                        }
                                    }}
                                    required
                                >
                                    <ComboboxInput placeholder="Select Amount" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] w-53 mt-4" />
                                    <ComboboxContent className="font-poppins">
                                        {amountOptionsLoading ? (
                                            <ComboboxItem value="loading" disabled>Loading...</ComboboxItem>
                                                ) : (
                                                    amountOptions?.map((option) => (
                                                        <ComboboxItem key={option.id} value={option.amount}>
                                                            ₹ {option.amount}
                                                        </ComboboxItem>
                                                    ))
                                                )
                                        }
                                        <ComboboxItem value="Other">Other</ComboboxItem>
                                    </ComboboxContent>
                                </Combobox>

                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500 font-poppins">
                                        {error?.message}
                                    </p>
                                ))}

                                {field.state.value === "Other" && (
                                    <form.Field name="otherAmount">
                                        {(field) => (
                                            <div className="mt-4 font-poppins animate-in fade-in slide-in-from-top-1">
                                                <InputGroup>
                                                    <InputGroupInput 
                                                        placeholder="Specify your amount"
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary font-poppins w-53"
                                                    />
                                                    <InputGroupAddon>
                                                        <HugeiconsIcon icon={RupeeIcon} size={24} />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {field.state.meta.errors.map((error) => (
                                                    <p key={error?.message} className="text-red-500 font-poppins">
                                                        {error?.message}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </form.Field>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>
                </div>

                <div className="flex-1 mt-20">
                    <div>
                        <form.Field name="involvement">
                            {(field) => (
                                <div className="space-y-2">
                                    <MultiSelect
                                        placeholder="Select wings of involvement"
                                        options={involvementOptions?.map((option) => ({
                                            value: String(option.id),
                                            label: `${option.name} (${option.purpose})`
                                        })) || []}
                                        value={field.state.value}
                                        onChange={(val) => field.handleChange(val)}
                                        className="mt-2 px-2 font-poppins"
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
                
                    <div>
                        <form.Field name="areaOfInterest">
                            {(field) => (
                                <div className="space-y-2">
                                    <MultiSelect
                                        placeholder="Select areas of interest"
                                        options={interestOptions?.map((option) => ({
                                            value: String(option.id),
                                            label: `${option.name}`
                                        })) || []}
                                        value={field.state.value}
                                        onChange={(val) => field.handleChange(val)}
                                        className="mt-2 px-2 font-poppins"
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

                    <p className="mt-20 font-poppins font-bold text-[28px] leading-8.25 text-[#604D00]">Declaration</p>
                    <form.Field name="termsAccepted">
                        {(field) => (
                            <div className="flex flex-row items-start mt-5">
                                <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    checked={field.state.value}
                                    onCheckedChange={(checked) => field.handleChange(checked)}
                                    onBlur={field.handleBlur}
                                    className="mr-2 mt-1"
                                />
                                <Label htmlFor={field.name} className="font-poppins font-medium text-[14px] leading-6 text-[#604D004D] cursor-pointer">
                                    I confirm that the information provided is true to the best of my knowledge and I accept the <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">terms and conditions</a>.
                                </Label>
                                {field.state.meta.errors.map((error) => (
                                    <p key={error?.message} className="text-red-500 font-poppins">
                                        {error?.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </form.Field>

                <form.Subscribe>
                    {(state) => (
                        <div>
                            <Button
                                variant="outline"
                                type="submit"
                                className="bg-linear-to-r mt-20 from-[#DB7A04] to-[#F1980F] text-white hover:text-white font-semibold text-[15px] rounded-[40px] py-5 w-full font-poppins hover:cursor-pointer"
                                disabled={!state.canSubmit || state.isSubmitting}
                            >
                                {state.isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
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
        </div>
    )
}