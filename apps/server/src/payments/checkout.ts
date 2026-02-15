import Razorpay from "razorpay";
import { db, eq, and } from "@repo/db";
import { Elysia, t } from "elysia";
import { auth } from "@repo/auth";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const CheckoutRoutes = new Elysia({ prefix: '/payments/checkout' })
    .macro({
        auth: {
            async resolve({ status, set, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
                
                if (!session) {
                    set.status = 401;
                    return {
                        error: "Unauthorized",
                        user: null
                    };
                }
                
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .post("/create", async ({ query, body, set }) => {
        const { amountId, frequencyId, isRecurring } = body;
        const { userId } = query;

        try {
            // 1. Recurring Payment (Subscription) logic
            if (isRecurring) {
                if (!frequencyId) throw new Error("Frequency is required for subscriptions");

                // Find the specific Plan ID for this Amount + Frequency combination
                const mapping = await db.query.planMappings.findFirst({
                    where: (m, { eq, and }) => and(
                        eq(m.amountId, amountId),
                        eq(m.frequencyId, frequencyId)
                    )
                });

                if (!mapping) {
                    set.status = 404;
                    return { error: "This payment plan has not been synced yet." };
                }

                const subscription = await razorpay.subscriptions.create({
                    plan_id: mapping.razorpayPlanId,
                    customer_notify: 1,
                    total_count: 60, // e.g., 5 years
                    notes: {
                        userId: userId,
                        type: 'subscription'
                    }
                });

                return { 
                    type: 'subscription', 
                    subscriptionId: subscription.id,
                    key: process.env.RAZORPAY_KEY_ID 
                };
            }

            // 2. One-time Payment (Order) logic
            const amountRecord = await db.query.contributionAmountOptions.findFirst({
                where: (amt, { eq }) => eq(amt.id, amountId)
            });

            if (!amountRecord) throw new Error("Invalid amount selected");

            const order = await razorpay.orders.create({
                amount: Math.round(Number(amountRecord.amount) * 100), // Convert to paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                notes: {
                    userId: userId,
                    type: 'one_time'
                }
            });

            return { 
                type: 'order', 
                orderId: order.id, 
                amount: order.amount,
                key: process.env.RAZORPAY_KEY_ID 
            };

        } catch (error: any) {
            set.status = 500;
            return { error: error.message || "Failed to create checkout session" };
        }
    }, {
        auth: true,
        query: t.Object({
            userId: t.String(),
        }),
        body: t.Object({
            amountId: t.Number(),
            isRecurring: t.Boolean(),
            frequencyId: t.Optional(t.Number()), // Only needed if isRecurring is true
        })
    });
