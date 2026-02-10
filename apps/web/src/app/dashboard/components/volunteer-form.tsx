'use client';
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { SelectItem, SelectValue, Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/eden";
import { Input } from "@base-ui/react/input"
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

export const VolunteerForm = () => {
    const { state } = useAuth();
    const userId = state.user?.id;

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

    const form = useForm({
        defaultValues: {
            age: "",
            profession: "",
            collegeName: "",
            otherProfession: "",
            gender: "",
            contactNumber: "",
            bloodGroup: "",
            state: "",
            district: "",
            education: "",
            involvement: [] as string[],
            priorityWing: "",
            areaOfInterest: "",
            contribute: "",
        },
        onSubmit: async ({ value }) => {

        },
        validators: {
            onSubmit: z.object({
                age: z.coerce.number().min(2, "Age does not meet the required age"),
                profession: z.string().min(1, "Please select a profession"),
                otherProfession: z.string().optional(),
            }).refine((data) => {
                if (data.profession === "other" && !data.otherProfession) {
                    return false;
                }
                return true;
            }, {
                message: "Please specify your profession",
                path: ["otherProfession"],
            })
        }
    });

    return (
        <div className="flex w-full min-h-screen gap-6 p-10">
            <div className="flex-1 border-r">
                <div className="text-[38px] font-bold text-[#DB7A05] font-poppins leading-8.25">Volunteer</div>
                <div className="text-[28px] font-bold text-[#604D00] font-poppins leading-8.25 mt-3">Personal Information</div>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
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
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-0 font-poppins font-medium text-[14px] mt-4 leading-8.25"
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
                                    <Select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        required
                                    >
                                        <SelectTrigger className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4">
                                            {field.state.value ? <SelectValue /> : "Gender"}
                                        </SelectTrigger>
                                        <SelectContent className="font-poppins">
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        className="border-0 border-b border-input rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary px-0 font-poppins font-medium text-[14px] mt-4 leading-8.25"
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
                        <form.Field name="bloodGroup">
                            {(field) => (
                                <div className="space-y-2">
                                    <Select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        required
                                    >
                                        <SelectTrigger className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4">
                                            {field.state.value ? <SelectValue /> : "Blood Group"}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="AB+">AB+</SelectItem>
                                                <SelectItem value="AB-">AB-</SelectItem>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="education">
                            {(field) => (
                                <div className="space-y-2">
                                    <Select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        required
                                    >
                                        <SelectTrigger className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4">
                                            {field.state.value ? <SelectValue /> : "Education"}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Graduate">Graduate</SelectItem>
                                                <SelectItem value="post-graduate">Post Graduate</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="profession">
                            {(field) => {
                                const studentOption = data?.find((opt) => opt.name === "Student");
                                const isStudent = field.state.value === String(studentOption?.id);

                                return (
                                    <div className="space-y-2">
                                    <Select 
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onValueChange={(val) => {
                                            field.handleChange(field.state.value);
                                            if (studentOption && val !== String(studentOption.id)) {
                                               form.setFieldValue('collegeName', '');
                                            }
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="border-0 border-b rounded-none shadow-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-primary font-poppins font-medium text-[14px] mt-4">
                                            {field.state.value ? <SelectValue /> : "Profession"}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Professions</SelectLabel>
                                                    {isLoading ? (
                                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                                            ) : (
                                                                data?.map((option) => (
                                                                    <SelectItem key={option.id} value={option.id}>
                                                                        {option.name}
                                                                    </SelectItem>
                                                                ))
                                                            )
                                                    }
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

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
                                                        placeholder="Please specify your profession"
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
                                        className="mt-2"
                                    />

                                    {field.state.meta.errors && (
                                        <p className="text-[12px] text-red-500 font-poppins">
                                            {field.state.meta.errors}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>
                    
                    <div>

                    </div>

                </form>
            </div>

            <div className="flex-1">
                <h2 className="text-xl font-bold">Volunteer interests</h2>
            </div>
        </div>
    )
}