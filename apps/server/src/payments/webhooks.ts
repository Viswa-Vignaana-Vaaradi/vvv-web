import { Elysia } from "elysia";
import { db, eq, and, desc } from "@repo/db";
import { patronContributions, transactions, subscriptions, } from "@repo/db/schema/core-schema";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { axiom } from "../utils/axiom";

export const WebhookRoutes = new Elysia({ prefix: '/payments/webhook' })
    .onParse(async ({ request, contentType }) => {
        return await request.text();
    })
    .post("/", async ({ request, body, headers, set }) => {
        const rawBody = body as string;
        const signature = headers['x-razorpay-signature'];
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

        await axiom.ingest('vvv-web-logs', [{ 
            event: 'received', 
            headers, 
            body: JSON.stringify(body).slice(0, 500) // Log snippet
        }]);

        const isValid = validateWebhookSignature(
            rawBody,
            signature as string,
            secret
        );

        if (!isValid) {
            set.status = 400;
            return { error: "Invalid signature" };
        }
        
        const jsonBody = JSON.parse(rawBody);
        const event = jsonBody.event; 
        const payload = jsonBody.payload;

        await axiom.flush();

        try {
            await db.transaction(async (tx) => {
                await axiom.ingest('vvv-web-logs', [{ 
                    type: 'db_transaction_start', 
                    razorpay_event: (body as any).event 
                }]);
                console.log(`Processing ${event}`);
                
                // CASE 1: ONE-TIME PAYMENT (OR FIRST PAYMENT OF ORDER)
                if (event === "payment.captured" || event === "order.paid") {
                    const entity = event === "order.paid" ? payload.order.entity : payload.payment.entity;
                    const notes = entity.notes || {};
                    const userId = notes.userId;
                    const email = notes.email;

                    const razorpayPaymentId = event === "order.paid" ? payload.payment?.entity?.id || entity.id : entity.id;
                    const payment = payload.payment.entity;

                    await tx.insert(transactions).values({
                        userId: userId,
                        guestEmail: !userId ? email : null,
                        razorpayPaymentId: razorpayPaymentId,
                        razorpayOrderId: event === "order.paid" ? entity.id : entity.order_id,
                        amount: String(payment.amount / 100),
                        status: "SUCCESS",
                        receiptNumber: entity.receipt || `${razorpayPaymentId}`,
                        createdAt: new Date(),
                    })
                    .onConflictDoNothing({ target: transactions.razorpayPaymentId });

                    // Activate the contribution record created in PatronForm
                    if (userId) {
                        await tx.update(patronContributions)
                        .set({ isActive: true })
                        .where(and(
                            eq(patronContributions.userId, userId),
                            eq(patronContributions.isActive, false)
                        ));
                    }
                    console.log(`Successfully processed ${event} for ${payment.id}`);
                }

                // CASE 2: NEW SUBSCRIPTION ACTIVATED
                if (event === "subscription.activated") {
                    const sub = payload.subscription.entity;
                    const email = sub.notes.email;
                    const userId = sub.notes.userId;
                    const frequency = sub.notes.frequency || "Monthly";

                    await tx.insert(subscriptions).values({
                        userId: userId,
                        guestEmail: !userId ? email : null,
                        razorpaySubscriptionId: sub.id,
                        amountId: sub.plan_id,
                        frequency: frequency,
                        status: sub.status.toUpperCase(),
                        currentStart: new Date(sub.current_start * 1000),
                        currentEnd: new Date(sub.current_end * 1000),
                    });

                    // Ensure the contribution record is active
                    await tx.update(patronContributions)
                        .set({ isActive: true })
                        .where(and(
                            eq(patronContributions.userId, userId),
                            eq(patronContributions.isActive, false)
                        ));
                }

                // CASE 3: RECURRING MONTHLY CHARGE SUCCESSFUL
                if (event === "subscription.charged") {
                    const sub = payload.subscription.entity;
                    const email = sub.notes.email;
                    const payment = payload.payment.entity;
                    const userId = sub.notes.userId;

                    // 1. Log the new monthly transaction
                    await tx.insert(transactions).values({
                        userId: userId,
                        guestEmail: !userId ? email : null,
                        razorpayPaymentId: payment.id,
                        razorpaySubscriptionId: sub.id,
                        amount: String(payment.amount / 100),
                        status: "SUCCESS",
                        receiptNumber: `RECUR-${payment.id}`,
                        createdAt: new Date(),
                    });

                    // 2. Update subscription dates to the new month
                    await tx.update(subscriptions)
                        .set({
                            currentStart: new Date(sub.current_start * 1000),
                            currentEnd: new Date(sub.current_end * 1000),
                            status: sub.status.toUpperCase(),
                            updatedAt: new Date(),
                        })
                        .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
                }

                // CASE 4: SUBSCRIPTION CANCELLED OR EXPIRED
                if (event === "subscription.cancelled" || event === "subscription.expired") {
                    const sub = payload.subscription.entity;
                    
                    await tx.update(subscriptions)
                        .set({ status: "CANCELLED" })
                        .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
                        
                    // Optional: Deactivate contribution if they stop paying
                    await tx.update(patronContributions)
                        .set({ isActive: false })
                        .where(eq(patronContributions.userId, sub.notes.userId));
                }
            });

            await axiom.flush();
            return { received: true };

        } catch (error: any) {
            await axiom.ingest('vvv-web-logs', [{
                level: 'error', 
                message: error.message, 
                stack: error.stack 
            }]);
            console.error("Webhook DB Error:", error);
            set.status = 500;
            return { error: "Internal processing failed" };
        }
    });
