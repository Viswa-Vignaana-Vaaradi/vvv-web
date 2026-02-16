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
    .post("/", async ({ query, body, set }) => {
        const { amount, frequency, otherAmount } = body;
        const { userId } = query;

        try {
        let finalAmount: number;

        // 1. Determine the Amount
        if (amount === "Other") {
            finalAmount = Number(otherAmount);
        } else {
            // Try to find the record in DB
            const amountRecord = await db.query.contributionAmountOptions.findFirst({
                where: (amt, { eq }) => eq(amt.amount, amount)
            });
            
            // If DB record exists, use it; otherwise, try to parse the 'amount' string directly
            finalAmount = amountRecord ? Number(amountRecord.amount) : Number(amount);
        }

        // Critical Check: Is finalAmount actually a valid number?
        if (isNaN(finalAmount) || finalAmount <= 0) {
            set.status = 400;
            return { error: "A valid payment amount is required" };
        }

        const isOneTime = !frequency || frequency.toLowerCase().includes("one-time") || amount === "Other";

        // 2. Subscription Logic
        if (!isOneTime) {
            // Subscriptions MUST have a mapped Plan ID in your system
            const mapping = await db.query.planMappings.findFirst({
                where: (m, { eq, and }) => and(eq(m.amount, amount), eq(m.frequency, frequency!))
            });

            if (!mapping?.razorpayPlanId) {
                set.status = 400;
                return { error: "Subscription plan not found for this combination" };
            }

            const subscription = await razorpay.subscriptions.create({
                plan_id: mapping.razorpayPlanId,
                customer_notify: 1,
                total_count: 12,
                notes: { userId: userId ?? null, email: body.email ?? null, type: "subscription" }
            });

            return { type: "subscription", id: subscription.id };
        }

        // 3. One-Time Payment Logic
        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100), // Razorpay expects paise
            currency: "INR",
            notes: {
                userId: userId ?? null,
                email: body.email ?? null,
                type: 'one-time'
            }
        });

        return { type: 'order', id: order.id };

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
            amount: t.String(),
            email: t.Optional(t.String()),
            frequency: t.Optional(t.String()),
            otherAmount: t.String()
        })
    });
