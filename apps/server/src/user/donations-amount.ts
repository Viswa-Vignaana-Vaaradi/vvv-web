import { auth } from "@repo/auth";
import { and, db, desc, eq } from "@repo/db";
import { patronContributions, transactions } from "@repo/db/schema/core-schema";
import Elysia, { t } from "elysia";

export const DonationsAmount = new Elysia({ prefix: "/user/donations" })
    .macro({
        auth: {
            async resolve({ status, set, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
                
                if (!session) return status(401);
                        
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .get("/", async ({ set, query }) => {
        const { userId } = query;

        if (!userId) {
            set.status = 400;
            return { error: "User ID is required" };
        }

        const userDonations = await db.query.transactions.findMany({
            where: eq(transactions.userId, userId),
            orderBy: [desc(transactions.createdAt)],
        });

        const totalAmount = userDonations.reduce((sum, tx) => {
            // Only sum successful transactions
            if (tx.status === "SUCCESS") {
                return sum + Number(tx.amount);
            }
            return sum;
        }, 0);

        return {
            totalAmount,
            count: userDonations.length,
            history: userDonations
        };
    }, {
        query: t.Object({
            userId: t.String()
        }),
        auth: true
    })
    .get("/history", async ({ query, set }) => {
        const { userId } = query;

    if (!userId) {
        set.status = 400;
        return { error: "User ID is required" };
    }

    // 1. Get Transaction History
    const history = await db.query.transactions.findMany({
        where: eq(transactions.userId, userId),
        orderBy: [desc(transactions.createdAt)],
    });

    // 2. Get Active Subscription Details (for the Top Card)
    const activePlan = await db.query.patronContributions.findFirst({
        where: and(
            eq(patronContributions.userId, userId),
            eq(patronContributions.isActive, true)
        ),
    });

    return {
        history: history.map((tx, index) => ({
            id: tx.id.toString(),
            sNo: index + 1,
            date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A",
            amount: Number(tx.amount),
            receipt: tx.receiptNumber,
        })),
        subscription: {
            amount: activePlan ? Number(activePlan.amount) : 0,
            frequency: activePlan?.frequency || "One-Time",
            nextDate: activePlan?.nextContributionDate 
                ? new Date(activePlan.nextContributionDate).toLocaleDateString() 
                : "N/A"
        }
    };
}, {
    query: t.Object({ userId: t.String() })
})
