import Elysia, { t } from "elysia";
import { auth } from "@repo/auth";
import { db } from "@repo/db";

export const getUserLocation = new Elysia({ prefix: "/location" })
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
    .get("/", async ({ query, set }) => {
        const location = await db.query.userLocation.findFirst({
            where: (userLocation, { eq }) => eq(userLocation.userId, query.userId)
        });

        if (!location) {
            set.status = 404;
            return {
                error: "Location not found for this user."
            };
        }
        set.status = 200;
            return location;
    }, {
        query: t.Object({
            userId: t.String()
        }),
        auth: true
    })
    
    