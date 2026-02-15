import { useForm } from "@tanstack/react-form"
import z from "zod"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import Image from "next/image"
import Office from "../public/office.svg";
import Email from "../public/email.svg";
import Phone from "../public/phone.svg";
import { Separator } from "./ui/separator";
import { api } from "@/lib/eden"

export const ContactUs = () => {
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            message: ""
        },
        onSubmit: async ({ value }) => {
            await api["contact-us"].post({
                name: value.email,
                email: value.email,
                message: value.message,
                $query: {},
                $headers: {},
            })
        },
        validators: {
            onSubmit: z.object({
                name: z.string().min(2, "Enter a valid name"),
                email: z.email("Invalid email address"),
                message: z.string().min(10, "Please enter a valid message")
            })
        }
    })

    return (
        <div className="bg-white p-12 flex flex-col md:flex-row gap-16">
            <div className="flex-2 flex flex-col">
                <h2 className="font-poppins font-bold text-[35px] leading-tight mb-8">
                    Have Something to Say?
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                    <form.Field name="name">
                        {(field) => (
                            <div className="flex-1 space-y-1">
                                <Label className="font-poppins text-black text-[14px] font-medium leading-8.25">Name</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter your name here"
                                    className="font-poppins italic text-[16px] py-6 px-6 shadow-[0px_2px_7px_0px_rgba(0,0,0,0.25)] rounded-[40px] bg-white border-none focus-visible:ring-1 focus-visible:ring-[#0E897F]"
                                />
                                {field.state.meta.errors && (
                                    <p className="text-red-500 text-xs ml-4">{field.state.meta.errors.join(",")}</p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="email">
                        {(field) => (
                            <div className="flex-1 space-y-1">
                                <Label className="font-poppins text-black text-[14px] font-medium leading-8.25">Email Address</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter you Email ID here"
                                    className="font-poppins italic text-[16px] py-6 px-6 shadow-[0px_2px_7px_0px_rgba(0,0,0,0.25)] rounded-[40px] bg-white border-none focus-visible:ring-1 focus-visible:ring-[#0E897F]"
                                />
                                {field.state.meta.errors && (
                                    <p className="text-red-500 text-xs ml-4">{field.state.meta.errors.join(",")}</p>
                                )}
                            </div>
                        )}
                    </form.Field>
                    </div>

                    <form.Field name="message">
                        {(field) => (
                            <div className="space-y-1">
                                <Label className="font-poppins text-black text-[14px] font-medium leading-8.25">Email Address</Label>
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter your message here"
                                    className="font-poppins italic text-[16px] py-6 px-6 shadow-[0px_2px_7px_0px_rgba(0,0,0,0.25)] rounded-[40px] bg-white border-none focus-visible:ring-1 focus-visible:ring-[#0E897F]"
                                />
                                {field.state.meta.errors && (
                                    <p className="text-red-500 text-xs ml-4">{field.state.meta.errors.join(",")}</p>
                                )}
                            </div>
                        )}
                    </form.Field>
                    
                    <div className="flex items-center justify-center">
                    <Button
                        type="submit"
                        className="bg-[#F1980F] hover:bg-[#F1980D] hover:cursor-pointer border-[0.6px] border-[#CCCCCC] border-solid text-white font-poppins font-bold py-5 px-5 rounded-[40px] transition-all"
                    >
                        Send Message
                    </Button>
                    </div>
                </form>
            </div>

            
            <div className="flex-1 flex flex-col justify-start p-8 bg-[#FFFBEB] rounded-[30px] shadow-[0px_2px_10px_2px_#00000026]">
                <div className="space-y-8">
                    <h3 className="font-poppins font-bold text-[24px] text-[#333]">Contact Us</h3>
                    <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                            <Image src={Office} alt="Office Address" width={40} height={40} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-poppins font-bold text-[16px] leading-tight text-[#604D00]">Office Address</p>
                            <p className="font-poppins font-medium text-[12px] leading-relaxed text-[#604D00]/70">
                                IA-Hub, South AU, Andhra University Vizag, Andhra Pradesh.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                            <Image src={Email} alt="Email Address" width={40} height={40} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-poppins font-bold text-[16px] leading-tight text-[#604D00]">Email Address</p>
                            <p className="font-poppins font-medium text-[12px] leading-tight text-[#604D00]/70">
                                viswavignanavaaradi@gmail.com
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                            <Image src={Phone} alt="Phone Number"width={40} height={40} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-poppins font-bold text-[16px] leading-tight text-[#604D00]">Phone Number</p>
                            <p className="font-poppins font-medium text-[12px] leading-tight text-[#604D00]/70">
                                +91 90109 37358
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col items-center">
                        <div className="font-poppins font-medium text-[10px] leading-[100%] text-[#604D0066]/60 italic">Our Team typically responds with in 24-48 Hrs,</div>
                        <div className="font-poppins font-medium text-[10px] leading-[100%] text-[#604D0066]/60 italic">Please be patient.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}