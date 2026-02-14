import { auth } from "@repo/auth";
import { db } from "@repo/db";
import Elysia, { t } from "elysia";

export const userRole = new Elysia({ prefix: "/user-role" })
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
        const membership = await db.query.memberships.findFirst({
            where: (memberships, { eq }) => eq(memberships.userId, query.userId),
            columns: {
                roleName: true
            }
        });

        set.status = 200;
        return {
            userRole: membership?.roleName ?? null
        };
    }, {
        query: t.Object({
            userId: t.String(),
        }),
        auth: true,
        response: {
            200: t.Object({
                userRole: t.Nullable(t.String()),
            }),
        }
    })