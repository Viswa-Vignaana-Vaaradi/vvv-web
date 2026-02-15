import { Elysia } from "elysia";
import { db, eq, and, desc } from "@repo/db";
import { patronContributions, transactions, subscriptions, } from "@repo/db/schema/core-schema";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export const WebhookRoutes = new Elysia({ prefix: '/payments/webhook' })
    .post("/", async ({ body, headers, set }) => {
        const signature = headers['x-razorpay-signature'];
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

        const isValid = validateWebhookSignature(
            JSON.stringify(body),
            signature as string,
            secret
        );

        if (!isValid) {
            set.status = 400;
            return { error: "Invalid signature" };
        }

        const { event, payload } = body as any;

        try {
            await db.transaction(async (tx) => {
                
                // CASE 1: ONE-TIME PAYMENT (OR FIRST PAYMENT OF ORDER)
                if (event === "order.paid") {
                    const order = payload.order.entity;
                    const payment = payload.payment.entity;
                    const userId = order.notes.userId;

                     await tx.insert(transactions).values({
                        userId: userId,
                        razorpayPaymentId: payment.id,
                        razorpayOrderId: order.id,
                        amount: String(order.amount / 100),
                        status: "SUCCESS",
                        // Using Razorpay's receipt or falling back to Payment ID
                        receiptNumber: order.receipt || `${payment.id}`,
                        createdAt: new Date(),
                    });

                    // Activate the contribution record created in PatronForm
                    await tx.update(patronContributions)
                        .set({ isActive: true })
                        .where(and(
                            eq(patronContributions.userId, userId),
                            eq(patronContributions.isActive, false)
                        ));
                }

                // CASE 2: NEW SUBSCRIPTION ACTIVATED
                if (event === "subscription.activated") {
                    const sub = payload.subscription.entity;
                    const userId = sub.notes.userId;
                    const frequency = sub.notes.frequency || "Monthly";

                    await tx.insert(subscriptions).values({
                        userId: userId,
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
                    const payment = payload.payment.entity;
                    const userId = sub.notes.userId;

                    // 1. Log the new monthly transaction
                    await tx.insert(transactions).values({
                        userId: userId,
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

            return { received: true };

        } catch (error: any) {
            console.error("Webhook DB Error:", error);
            set.status = 500;
            return { error: "Internal processing failed" };
        }
    });
