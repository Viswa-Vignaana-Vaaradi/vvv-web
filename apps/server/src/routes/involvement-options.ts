import { auth } from "@repo/auth";
import { db } from "@repo/db";
import Elysia from "elysia";

export const involvementAreasOptions = new Elysia({ prefix: "/options/involvement" })
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
                console.log("Session:", session);

                if (!session) return status(401);
    
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .get("/", async () => {
        const fetchedInvolvementOptions = await db.query.involvementAreasOptions.findMany();
        return fetchedInvolvementOptions;
    }, {
        auth: true
    })