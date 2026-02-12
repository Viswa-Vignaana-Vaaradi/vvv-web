import { auth } from "@repo/auth";
import { db } from "@repo/db";
import Elysia from "elysia";

export const ContributionAmountOptions = new Elysia({ prefix: "/options/contribution-amount" })
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
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
    .get("/", async () => {
        const fetchedAmountOptions = await db.query.contributionAmountOptions.findMany();
        return fetchedAmountOptions;
    }, {
        auth: true
    })