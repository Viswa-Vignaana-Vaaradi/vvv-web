import { auth } from "@repo/auth";
import { db, eq } from "@repo/db";
import { memberships } from "@repo/db/schema/core-schema";
import Elysia, { t } from "elysia";

export const memberCode = new Elysia({ prefix: "/user/member-code" })
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

        const fetchedMemberCode = await db.query.memberships.findFirst({
            where: eq(memberships.userId, userId)
        });

        if (!fetchedMemberCode) {
            set.status = 404;
            return { error: "Member code not found" };
        }

        return fetchedMemberCode;
    }, {
        query: t.Object({
            userId: t.String()
        }),
        auth: true
    })
