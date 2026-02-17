import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { auth } from "@repo/auth";
import { env } from "@repo/env/server";
import { Elysia } from "elysia";
import { professionsOptions } from "./routes/profession-options";
import { getUserLocation } from "./user/user-location";
import { aboutMe } from "./user/about-me";
import { userRole } from "./user/user-role";
import { involvementAreasOptions } from "./routes/involvement-options";
import { AreasofInterestOptions } from "./routes/interest-options";
import { ContributionFrequencyOptions } from "./routes/contributions-frequency-options";
import { ContributionAmountOptions } from "./routes/contribution-amount-options";
import { VolunteerForm } from "./volunteer/volunteer-form";
import { PatronForm } from "./patron/patron-form";
import { CheckoutRoutes } from "./payments/checkout";
import { WebhookRoutes } from "./payments/webhooks";
import { ContactUs } from "./routes/contact-us";
import { memberCode } from "./user/member-code";
import { DonationsAmount } from "./user/donations-amount";

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-razorpay-signature", "x-razorpay-event-id"],
      credentials: true,
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      console.log(`Handling ${request.method} request for ${request.url}`);
      return auth.handler(request);
    }
    return status(405);
  })
  .get("/", () => "OK")
  .mount(auth.handler)
  .use(professionsOptions)
  .use(involvementAreasOptions)
  .use(AreasofInterestOptions)
  .use(ContributionFrequencyOptions)
  .use(ContributionAmountOptions)
  .use(getUserLocation)
  .use(aboutMe)
  .use(userRole)
  .use(VolunteerForm)
  .use(PatronForm)
  .use(CheckoutRoutes)
  .use(WebhookRoutes)
  .use(ContactUs)
  .use(memberCode)
  .use(DonationsAmount)
  
  .listen(5050, () => {
    console.log("Server is running on http://localhost:5050");
  });

export type App = typeof app;
export default app;