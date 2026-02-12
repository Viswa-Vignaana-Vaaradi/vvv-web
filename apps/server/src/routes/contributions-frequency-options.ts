import { auth } from "@repo/auth";
import { db } from "@repo/db";
import Elysia from "elysia";

export const ContributionFrequencyOptions = new Elysia({ prefix: "/options/contribution-frequency" })
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
        const fetchedFrequencyOptiohns = await db.query.contributionFrequencyOptions.findMany();
        return fetchedFrequencyOptiohns;
    }, {
        auth: true
    })