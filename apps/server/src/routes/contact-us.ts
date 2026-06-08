import { resend } from "../utils/resend";
import Elysia, { t } from "elysia";

export const ContactUs = new Elysia({ prefix: "/contact-us" })
    .post("/", async ({ body, set, status }) => {
        
        const { data, error } = await resend.emails.send({
            from: "contact@viswavignanavaardhi.org",
            to: body.email,
            subject: "Contact Form Submission",
            html: `From: ${body.email} - ${body.name}:
                Message: ${body.message}`,
        });

        if (error) {
            set.status = 400;
            return { success: false, message: "Something went wrong. Please try again" };
        }

        console.log("Contact form submission email sent from:", body.email, "Resend data:", data?.id)

        return { success: true, message: "Message sent successfully!!" };
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            message: t.String()
        })
    }
)