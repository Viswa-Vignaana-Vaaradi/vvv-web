import { auth } from "@repo/auth";
import { db, desc, eq } from "@repo/db";
import { transactions } from "@repo/db/schema/core-schema";
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
    });