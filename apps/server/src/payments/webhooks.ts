// import { Elysia, t } from "elysia";
// import { db, eq } from "@repo/db";
// import { transactions } from "@repo/db/schema/core-schema";
// import Razorpay from "razorpay";

// export const RazorpayWebhook = new Elysia()
//     .post("/webhook/razorpay", async ({ body, headers, set, request }) => {
//         const signature = headers["x-razorpay-signature"];
//         const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

//         // 1. Verify Signature using raw body
//         const rawBody = await request.text();
//         const isValid = Razorpay.validateWebhookSignature(rawBody, signature, secret);

//         if (!isValid) {
//             set.status = 400;
//             return { error: "Invalid signature" };
//         }

//         const payload = JSON.parse(rawBody);
//         const event = payload.event;

//         // 2. Handle successful payment events
//         if (event === "payment.captured" || event === "subscription.charged") {
//             const payment = payload.payload.payment.entity;
//             const userId = payment.notes.userId; // Retrieved from notes passed during checkout

//             // IDEMPOTENCY CHECK: Ensure we haven't processed this payment already
//             const existing = await db.query.transactions.findFirst({
//                 where: (t, { eq }) => eq(t.razorpayPaymentId, payment.id)
//             });

//             if (existing) return { status: "already_processed" };

//             // 3. Record Transaction
//             const [newTransaction] = await db.insert(transactions).values({
//                 userId,
//                 razorpayPaymentId: payment.id,
//                 amount: (payment.amount / 100).toString(),
//                 status: "captured",
//                 receiptNumber: `REC-${Date.now()}`,
//                 // Link subscription ID if recurring
//                 razorpaySubscriptionId: payment.subscription_id || null, 
//             }).returning();

//             // 4. Trigger Receipt Generation (Background)
//             // Call your Vercel/Railway background worker or Inngest/Upstash function
//             await triggerReceiptJob(newTransaction.id);
//         }

//         return { success: true };
//     });
