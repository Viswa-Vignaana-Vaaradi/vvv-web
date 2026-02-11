'use client';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxLabel } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/eden";
import { Input } from "@base-ui/react/input"
import { useForm, type StandardSchemaV1 } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import z from "zod";

interface FormSchema {
    age: number | undefined;
    profession: string;
    collegeName: string;
    otherProfession: string;
    gender: string;
    contactNumber: string;
    bloodGroup: string;
    city: string;
    state: string;
    education: string;
    involvement: string[];
    areaOfInterest: string[];
    contribute: string;
}

const formSchema: z.ZodType<FormSchema> = z.object({
    age: z.preprocess(
        (val) => (val === "" || val === null ? undefined : Number(val)),
        z.union([z.number().min(2, "Age too young"), z.undefined()])
    ),
    profession: z.string().min(2, "Please select a profession"),
    collegeName: z.string().default(""),
    otherProfession: z.string().default(""),
    gender: z.string().min(3, "Please select a valid gender value"),
    contactNumber: z.string().min(10, "Please enter a valid contact number"),
    bloodGroup: z.string().min(2, "Please select a valid blood group"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().min(3, "Please enter a valid state"),
    education: z.string().min(5, "Please select a valid education level"),
    involvement: z.array(z.string()).min(1, "Please select a valid wings of involvement"),
    areaOfInterest: z.array(z.string()).min(1, "Please select an area of interest"),
    contribute: z.preprocess((val) => (val === true ? "yes" : "no"), z.string())
}).superRefine((data, ctx) => {
    if (data.profession === "Student" && (!data.collegeName || data.collegeName.length < 5)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please input a valid college name",
            path: ["collegeName"],
        });
    }
    if (data.profession === "other" && !data.otherProfession) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify your profession",
            path: ["otherProfession"],
        });
    }
});

export const VolunteerForm = () => {
    const { state } = useAuth();
    const userId = state.user?.id;
    const userRole = state.user?.userRole;
    const router = useRouter();

    if (userRole === "PATRON") {
        router.push("/dashboard")
    }

    const educationOptions = [
        { value: "Intermediate", label: "Intermediate" },
        { value: "Graduate", label: "Graduate" },
        { value: "Post Graduate", label: "Post Graduate" },
    ];

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

    const form = useForm({
        defaultValues: {
            age: undefined as number | undefined,
            profession: "",
            collegeName: "",
            otherProfession: "",
            gender: "",
            contactNumber: "",
            bloodGroup: "",
            city: "",
            state: "",
            education: "",
            involvement: [] as string[],
            areaOfInterest: [] as string[],
            contribute: "no",
        } as FormSchema,
        onSubmit: async ({ value }) => {

        },
        validators: {
            onSubmit: formSchema as StandardSchemaV1<FormSchema, FormSchema>,
        }
    });

    return (
        <div className="flex w-full min-h-screen gap-6 p-10">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="flex flex-1 space-y-4 space-x-6"
            >
                <div className="flex-1 border-r">
                    <div className="text-[38px] font-bold text-[#DB7A05] font-poppins leading-8.25">Volunteer</div>
                    <div className="text-[28px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Personal Information</div>
                
                    <div>
                        <form.Field name="age">
                            {(field) => (
                                <div className="space-y-2">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        placeholder="Age"
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.handleChange(val === "" ? undefined : Number(val) as any);
                                        }}
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-4 leading-8.25"
                                        required
                                    />
                                    {/* {field.state.meta.errors.map((error) => (
                                        <p key={error?.message} className="text-red-500">
                                            {error?.message}
                                        </p>
                                    ))} */}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="gender">
                            {(field) => (
                                <div className="space-y-2">
                                    <Combobox
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val ?? "")}
                                        required
                                    >
                                        <ComboboxInput placeholder="Gender" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins w-43.75 font-medium text-[14px] mt-4" />
                                        <ComboboxContent className="font-poppins">
                                            <ComboboxItem value="Male">Male</ComboboxItem>
                                            <ComboboxItem value="Female">Female</ComboboxItem>
                                            <ComboboxItem value="Prefer not to say">Prefer not to say</ComboboxItem>
                                        </ComboboxContent>
                                    </Combobox>
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
                                            <ComboboxInput placeholder="Profession" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] w-43.75 mt-4" />
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
                                                <ComboboxItem value="other">Other</ComboboxItem>
                                            </ComboboxContent>
                                        </Combobox>

                                        {isStudent && (
                                            <form.Field name="collegeName">
                                                {(subField) => (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-1">
                                                        <Input
                                                            placeholder="Enter your College Name"
                                                            value={subField.state.value}
                                                            onChange={(e) => subField.handleChange(e.target.value)}
                                                            onBlur={subField.handleBlur}
                                                            className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary font-poppins font-medium text-[14px]"
                                                        />
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
                                                            className="border-0 border-b rounded-none shadow-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                                        />
                                                    </div>
                                                )}
                                            </form.Field>
                                        )}
                                    </div>
                                )
                            }}
                        </form.Field>
                    </div>

                    <div className="mb-10">
                        <form.Field name="bloodGroup">
                            {(field) => (
                                <div className="space-y-2">
                                    <Combobox
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val ?? "")}
                                        required
                                    >
                                        <ComboboxInput placeholder="Blood Group" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] w-43.75 mt-4" />
                                        <ComboboxContent className="font-poppins">
                                            <ComboboxItem value="A+">A+</ComboboxItem>
                                            <ComboboxItem value="A-">A-</ComboboxItem>
                                            <ComboboxItem value="B+">B+</ComboboxItem>
                                            <ComboboxItem value="B-">B-</ComboboxItem>
                                            <ComboboxItem value="AB+">AB+</ComboboxItem>
                                            <ComboboxItem value="AB-">AB-</ComboboxItem>
                                            <ComboboxItem value="O+">O+</ComboboxItem>
                                            <ComboboxItem value="O-">O-</ComboboxItem>
                                        </ComboboxContent>
                                    </Combobox>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="text-[28px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Contact Information</div>

                    <div>
                        <form.Field name="city">
                            {(field) => (
                                <div className="space-y-2">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        placeholder="City"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
                                        required
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="state">
                            {(field) => (
                                <div className="space-y-2">
                                    <Combobox
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val ?? "")}
                                        required
                                    >
                                        <ComboboxInput placeholder="State" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] w-43.75 mt-4" />
                                        <ComboboxContent className="font-poppins">
                                            <ComboboxItem value="Andhra Pradesh">Andhra Pradesh</ComboboxItem>
                                            <ComboboxItem value="Arunachal Pradesh">Arunachal Pradesh</ComboboxItem>
                                            <ComboboxItem value="Assam">Assam</ComboboxItem>
                                            <ComboboxItem value="Bihar">Bihar</ComboboxItem>
                                            <ComboboxItem value="Chattisgarh">Chattisgarh</ComboboxItem>
                                            <ComboboxItem value="Goa">Goa</ComboboxItem>
                                            <ComboboxItem value="Gujarat">Gujarat</ComboboxItem>
                                            <ComboboxItem value="Haryana">Haryana</ComboboxItem>
                                            <ComboboxItem value="Himachal Pradesh">Himachal Pradesh</ComboboxItem>
                                            <ComboboxItem value="Jharkhand">Jharkhand</ComboboxItem>
                                            <ComboboxItem value="Karnataka">Karnataka</ComboboxItem>
                                            <ComboboxItem value="Kerala">Kerala</ComboboxItem>
                                            <ComboboxItem value="Madhya Pradesh">Madhya Pradesh</ComboboxItem>
                                            <ComboboxItem value="Maharashtra">Maharashtra</ComboboxItem>
                                            <ComboboxItem value="Manipur">Manipur</ComboboxItem>
                                            <ComboboxItem value="Meghalaya">Meghalaya</ComboboxItem>
                                            <ComboboxItem value="Mizoram">Mizoram</ComboboxItem>
                                            <ComboboxItem value="Nagaland">Nagaland</ComboboxItem>
                                            <ComboboxItem value="Odisha">Odisha</ComboboxItem>
                                            <ComboboxItem value="Punjab">Punjab</ComboboxItem>
                                            <ComboboxItem value="Rajasthan">Rajasthan</ComboboxItem>
                                            <ComboboxItem value="Sikkim">Sikkim</ComboboxItem>
                                            <ComboboxItem value="Tamil Nadu">Tamil Nadu</ComboboxItem>
                                            <ComboboxItem value="Telangana">Telangana</ComboboxItem>
                                            <ComboboxItem value="Tripura">Tripura</ComboboxItem>
                                            <ComboboxItem value="Uttar Pradesh">Uttar Pradesh</ComboboxItem>
                                            <ComboboxItem value="Uttarakhand">Uttarakhand</ComboboxItem>
                                            <ComboboxItem value="West Bengal">West Bengal</ComboboxItem>
                                        </ComboboxContent>
                                    </Combobox>
                                </div>
                            )}

                        </form.Field>
                    </div>
                    
                    <div>
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
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-3 font-poppins font-medium text-[14px] mt-2 leading-8.25"
                                        required
                                    />
                                    {/* {field.state.meta.errors.map((error) => (
                                        <p key={error?.message} className="text-red-500">
                                            {error?.message}
                                        </p>
                                    ))} */}
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
                            </div>
                        )}
                    </form.Field>
                </div>

                <div>
                    <form.Field name="education">
                        {(field) => (
                            <div className="space-y-2">
                                <Combobox
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onValueChange={(val) => field.handleChange(val ?? "")}
                                    required
                                    items={educationOptions}
                                >
                                    <ComboboxInput placeholder="Education" className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4" />
                                    <ComboboxContent className="font-poppins">
                                        {educationOptions.map((opt) => (
                                            <ComboboxItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        )}
                    </form.Field>
                </div>

                <p className="mt-10 font-poppins font-bold text-[28px] leading-8.25 text-[#604D00]">Declaration</p>
                <p className="mt-3 font-poppins font-medium text-[14px] leading-8.25 text-[#604D004D]">I confirm that the information provided is true to the best of my knowledge and I am willing to volunteer for viswa vignana vaaradhi</p>
            </div>
            </form>
        </div>
    )
}