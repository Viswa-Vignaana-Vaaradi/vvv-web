import { auth } from "@repo/auth";
import { db } from "@repo/db";
import Elysia from "elysia";

export const AreasofInterestOptions = new Elysia({ prefix: "/options/interest" })
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
        const fetchedInterestOptions = await db.query.interestedAreasOptions.findMany();
        return fetchedInterestOptions;
    })